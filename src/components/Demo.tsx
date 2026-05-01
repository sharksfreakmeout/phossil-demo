import { useState } from "react";
import { generateCard } from "../api";
import type { RecoveryCard as CardType } from "../types";
import RecoveryCard from "./RecoveryCard";
import type { FeedbackData } from "./RecoveryCard";

const roleCategories = [
  { category: "Engineering & Technical", roles: [
    { id: "software-engineer", label: "Software Engineer" },
    { id: "sre-devops", label: "SRE / DevOps / Infrastructure" },
    { id: "data-engineer", label: "Data Engineer / Data Scientist" },
    { id: "security-engineer", label: "Security Engineer" },
    { id: "qa-engineer", label: "QA / Test Engineer" },
    { id: "engineering-manager", label: "Engineering Manager" },
    { id: "technical-writer", label: "Technical Writer" },
    { id: "solutions-architect", label: "Solutions Architect" },
  ]},
  { category: "Product & Design", roles: [
    { id: "product-manager", label: "Product Manager" },
    { id: "product-designer", label: "Product Designer" },
    { id: "ux-researcher", label: "UX Researcher" },
    { id: "program-manager", label: "Program / Project Manager" },
  ]},
  { category: "Marketing & GTM", roles: [
    { id: "product-marketing", label: "Product Marketing" },
    { id: "content-marketing", label: "Content / Brand Marketing" },
    { id: "growth-marketing", label: "Growth / Performance Marketing" },
    { id: "partner-marketing", label: "Partner / Channel Marketing" },
    { id: "marketing-ops", label: "Marketing Ops / RevOps" },
  ]},
  { category: "Sales & Revenue", roles: [
    { id: "sdr-bdr", label: "SDR / BDR" },
    { id: "account-executive", label: "Account Executive" },
    { id: "sales-engineer", label: "Sales Engineer / Solutions" },
    { id: "customer-success", label: "Customer Success" },
    { id: "revenue-ops", label: "Revenue Operations" },
  ]},
  { category: "Finance & Accounting", roles: [
    { id: "financial-analyst", label: "Financial Analyst / FP&A" },
    { id: "accountant", label: "Accountant / Controller" },
    { id: "corporate-finance", label: "Corporate Finance / Treasury" },
    { id: "auditor", label: "Auditor" },
    { id: "tax-professional", label: "Tax Professional" },
  ]},
  { category: "Banking & Investment", roles: [
    { id: "investment-banker", label: "Investment Banker" },
    { id: "wealth-advisor", label: "Wealth Advisor / Financial Advisor" },
    { id: "trader", label: "Trader / Portfolio Manager" },
    { id: "risk-analyst", label: "Risk Analyst" },
    { id: "equity-research", label: "Equity Research Analyst" },
  ]},
  { category: "Legal & Compliance", roles: [
    { id: "corporate-lawyer", label: "Corporate / M&A Lawyer" },
    { id: "litigation-lawyer", label: "Litigation Lawyer" },
    { id: "in-house-counsel", label: "In-House Counsel" },
    { id: "compliance", label: "Compliance / Risk" },
    { id: "paralegal", label: "Paralegal" },
  ]},
  { category: "IT & Support", roles: [
    { id: "sysadmin", label: "Systems Administrator" },
    { id: "help-desk", label: "Help Desk / Technical Support" },
    { id: "it-manager", label: "IT Manager" },
    { id: "network-engineer", label: "Network Engineer" },
  ]},
  { category: "Operations & Strategy", roles: [
    { id: "business-ops", label: "Business Operations" },
    { id: "strategy", label: "Strategy / Corp Dev" },
    { id: "people-hr", label: "People / HR" },
    { id: "procurement", label: "Procurement / Supply Chain" },
  ]},
  { category: "Leadership", roles: [
    { id: "vp-engineering", label: "VP / Director of Engineering" },
    { id: "vp-product", label: "VP / Director of Product" },
    { id: "vp-marketing", label: "VP / Director of Marketing" },
    { id: "vp-sales", label: "VP / Director of Sales" },
    { id: "vp-finance", label: "VP / Director of Finance" },
    { id: "vp-operations", label: "VP / Director of Operations" },
    { id: "vp-people", label: "VP / Director of People" },
  ]},
  { category: "C-Suite", roles: [
    { id: "ceo", label: "CEO / Founder" },
    { id: "cto", label: "CTO" },
    { id: "coo", label: "COO" },
    { id: "cfo", label: "CFO" },
    { id: "cmo", label: "CMO" },
    { id: "cro", label: "CRO / Chief Revenue Officer" },
  ]},
  { category: "Professional Services", roles: [
    { id: "consultant", label: "Management Consultant" },
    { id: "journalist", label: "Journalist / Writer" },
    { id: "academic-researcher", label: "Academic Researcher" },
    { id: "therapist-clinician", label: "Therapist / Clinician" },
  ]},
];

const toolsByRole: Record<string, string[]> = {
  "software-engineer": ["VS Code", "GitHub", "GitLab", "Slack", "Teams", "Jira", "Linear", "Terminal", "Chrome", "Notion", "Confluence", "Copilot", "Docker", "Postman"],
  "sre-devops": ["Datadog", "PagerDuty", "Terraform", "Grafana", "Slack", "Teams", "Jira", "AWS Console", "GCP Console", "Azure Portal", "Terminal", "Confluence", "GitHub", "Ansible", "Kubernetes Dashboard"],
  "data-engineer": ["Python", "Jupyter", "Snowflake", "dbt", "Airflow", "Slack", "Teams", "GitHub", "Looker", "Power BI", "BigQuery", "Databricks", "Confluence", "Redshift", "Spark"],
  "security-engineer": ["Splunk", "CrowdStrike", "SentinelOne", "GitHub", "Terminal", "Jira", "Slack", "Teams", "AWS Console", "Azure Portal", "Burp Suite", "Confluence", "ServiceNow", "Qualys"],
  "qa-engineer": ["Playwright", "Cypress", "Selenium", "Jira", "TestRail", "Slack", "Teams", "GitHub", "Chrome DevTools", "Postman", "Confluence", "Linear", "VS Code", "Azure DevOps"],
  "engineering-manager": ["Slack", "Teams", "GitHub", "Jira", "Linear", "Google Docs", "Word", "Notion", "Confluence", "Zoom", "Lattice", "Google Sheets", "Excel", "15Five"],
  "technical-writer": ["Google Docs", "Word", "Confluence", "Notion", "ReadMe", "GitBook", "Slack", "Teams", "GitHub", "Markdown", "Snagit", "Figma", "Jira", "Chrome"],
  "solutions-architect": ["Lucidchart", "Miro", "Draw.io", "AWS Console", "Azure Portal", "GCP Console", "Slack", "Teams", "Google Slides", "PowerPoint", "Confluence", "Jira", "Terminal", "Postman"],
  "product-manager": ["Notion", "Linear", "Jira", "Figma", "Slack", "Teams", "Google Docs", "Word", "Miro", "Amplitude", "Mixpanel", "Loom", "Confluence", "Aha!", "Productboard"],
  "product-designer": ["Figma", "Sketch", "Miro", "Slack", "Teams", "Notion", "Chrome", "Loom", "Google Docs", "Maze", "Linear", "Abstract", "Principle", "Framer"],
  "ux-researcher": ["Dovetail", "Miro", "Google Docs", "Word", "Figma", "Slack", "Teams", "Zoom", "Qualtrics", "UserTesting", "Notion", "Google Sheets", "Excel", "Loom", "Optimal Workshop"],
  "program-manager": ["Asana", "Monday.com", "Jira", "Google Sheets", "Excel", "Slack", "Teams", "Confluence", "SharePoint", "Google Docs", "Word", "Zoom", "Smartsheet", "Notion", "Miro", "MS Project"],
  "product-marketing": ["Google Docs", "Word", "Google Slides", "PowerPoint", "Slack", "Teams", "Notion", "Confluence", "Figma", "Gong", "Salesforce", "HubSpot", "Loom", "Highspot"],
  "content-marketing": ["Google Docs", "Word", "WordPress", "Webflow", "Slack", "Teams", "Figma", "Canva", "Ahrefs", "SEMrush", "Google Analytics", "Notion", "HubSpot", "Grammarly", "Jasper"],
  "growth-marketing": ["Google Analytics", "GA4", "Google Ads", "Meta Ads Manager", "HubSpot", "Marketo", "Slack", "Teams", "Google Sheets", "Excel", "Looker", "Power BI", "Notion", "Amplitude", "Optimizely", "Segment"],
  "partner-marketing": ["Google Docs", "Word", "Google Slides", "PowerPoint", "Salesforce", "Slack", "Teams", "Tableau", "Power BI", "Smartsheet", "HubSpot", "Notion", "Excel", "Asana"],
  "marketing-ops": ["HubSpot", "Marketo", "Pardot", "Salesforce", "Google Sheets", "Excel", "Slack", "Teams", "Looker", "Power BI", "Zapier", "Google Analytics", "Notion", "Segment"],
  "sdr-bdr": ["Salesforce", "HubSpot", "Outreach", "SalesLoft", "LinkedIn Sales Navigator", "Slack", "Teams", "ZoomInfo", "Apollo", "Gong", "Zoom", "Gmail", "Outlook", "Vidyard"],
  "account-executive": ["Salesforce", "HubSpot", "Gong", "Chorus", "Slack", "Teams", "Google Docs", "Word", "LinkedIn", "Zoom", "Outreach", "SalesLoft", "Google Slides", "PowerPoint", "Clari", "DocuSign"],
  "sales-engineer": ["Postman", "Salesforce", "Slack", "Teams", "Google Docs", "Word", "Terminal", "Chrome", "Zoom", "Confluence", "SharePoint", "Jira", "VS Code", "Demo environments"],
  "customer-success": ["Salesforce", "Gainsight", "ChurnZero", "Totango", "Slack", "Teams", "Zoom", "Google Docs", "Word", "Notion", "Loom", "Jira", "Google Sheets", "Excel", "Pendo"],
  "revenue-ops": ["Salesforce", "HubSpot", "Google Sheets", "Excel", "Looker", "Power BI", "Slack", "Teams", "Notion", "Clari", "Outreach", "Tableau", "LeanData", "Zuora"],
  "financial-analyst": ["Excel", "Google Sheets", "PowerPoint", "Google Slides", "Bloomberg", "Slack", "Teams", "SAP", "Oracle", "NetSuite", "Tableau", "Power BI", "Outlook", "Gmail", "Adaptive Planning", "Anaplan"],
  "accountant": ["NetSuite", "QuickBooks", "Sage", "Xero", "Excel", "Google Sheets", "Outlook", "Gmail", "Slack", "Teams", "Bill.com", "Expensify", "SharePoint", "BlackLine"],
  "corporate-finance": ["Excel", "Bloomberg", "Capital IQ", "FactSet", "PowerPoint", "Google Slides", "Outlook", "Gmail", "Teams", "Slack", "SAP", "Adaptive Planning", "Anaplan", "Word"],
  "auditor": ["Excel", "Google Sheets", "Word", "CaseWare", "TeamMate", "Workiva", "Outlook", "Gmail", "Teams", "Slack", "SharePoint", "SAP", "Oracle", "PowerPoint", "Adobe Acrobat"],
  "tax-professional": ["Excel", "Google Sheets", "Thomson Reuters UltraTax", "CCH Axcess", "Word", "Outlook", "Gmail", "Teams", "Slack", "SharePoint", "SAP", "Oracle", "Adobe Acrobat", "GoSystem"],
  "investment-banker": ["Excel", "PowerPoint", "Bloomberg", "Capital IQ", "FactSet", "PitchBook", "Word", "Outlook", "Teams", "Slack", "DealCloud", "Intralinks", "Adobe Acrobat", "S&P Global"],
  "wealth-advisor": ["Salesforce", "Wealthbox", "Redtail", "MoneyGuidePro", "eMoney", "Excel", "Outlook", "Teams", "Slack", "Morningstar", "Bloomberg", "Google Sheets", "Word", "DocuSign"],
  "trader": ["Bloomberg Terminal", "Eikon (Refinitiv)", "Excel", "Python", "Slack", "Teams", "Charles River", "Fidessa", "TradingView", "Outlook", "Reuters", "MATLAB"],
  "risk-analyst": ["Excel", "Python", "SAS", "Bloomberg", "Moody's Analytics", "Slack", "Teams", "Outlook", "Power BI", "Tableau", "Word", "PowerPoint", "MATLAB", "R Studio"],
  "equity-research": ["Bloomberg", "Capital IQ", "FactSet", "Excel", "Word", "PowerPoint", "Outlook", "Teams", "Slack", "Visible Alpha", "Koyfin", "Python", "Thomson Reuters"],
  "corporate-lawyer": ["Word", "Google Docs", "Outlook", "Gmail", "Westlaw", "LexisNexis", "iManage", "NetDocuments", "Excel", "SharePoint", "Teams", "Slack", "DocuSign", "Ironclad"],
  "litigation-lawyer": ["Westlaw", "LexisNexis", "Word", "Outlook", "Relativity", "Concordance", "iManage", "NetDocuments", "Excel", "Teams", "SharePoint", "Chrome", "Adobe Acrobat", "CaseMap"],
  "in-house-counsel": ["Word", "Google Docs", "Slack", "Teams", "DocuSign", "Ironclad", "ContractPodAi", "Jira", "Notion", "Outlook", "Gmail", "SharePoint", "Chrome", "SimpleLegal"],
  "compliance": ["Excel", "Google Sheets", "Word", "Google Docs", "SharePoint", "Outlook", "Gmail", "Teams", "Slack", "Archer", "ServiceNow", "LogicGate", "PowerPoint", "OneTrust"],
  "paralegal": ["Word", "Westlaw", "LexisNexis", "iManage", "NetDocuments", "Excel", "Outlook", "Adobe Acrobat", "SharePoint", "Teams", "Slack", "Relativity", "CaseMap"],
  "sysadmin": ["Active Directory", "VMware", "Ansible", "PowerShell", "Terminal", "Slack", "Teams", "Jira", "ServiceNow", "Zendesk", "AWS Console", "Azure Portal", "Confluence", "Nagios", "Splunk"],
  "help-desk": ["ServiceNow", "Zendesk", "Freshdesk", "Jira Service Management", "Slack", "Teams", "Remote Desktop", "Active Directory", "Confluence", "SharePoint", "Chrome", "Outlook", "Gmail"],
  "it-manager": ["ServiceNow", "Jira", "Slack", "Teams", "Google Sheets", "Excel", "Confluence", "SharePoint", "Zoom", "Okta", "Jamf", "Intune", "Active Directory", "Power BI"],
  "network-engineer": ["Cisco IOS", "Wireshark", "SolarWinds", "Palo Alto", "Terminal", "Slack", "Teams", "Jira", "ServiceNow", "Nagios", "Splunk", "Meraki", "AWS Console", "Azure Portal"],
  "business-ops": ["Google Sheets", "Excel", "Notion", "Slack", "Teams", "Asana", "Monday.com", "Google Docs", "Word", "Looker", "Power BI", "Zoom", "Salesforce", "Confluence"],
  "strategy": ["Google Slides", "PowerPoint", "Excel", "Google Docs", "Word", "Slack", "Teams", "Capital IQ", "PitchBook", "Notion", "Zoom", "Tableau", "Power BI", "Chrome"],
  "people-hr": ["Workday", "BambooHR", "ADP", "Lattice", "15Five", "Google Docs", "Word", "Slack", "Teams", "Greenhouse", "Lever", "Notion", "Google Sheets", "Excel", "Zoom", "Culture Amp"],
  "procurement": ["SAP Ariba", "Oracle", "Coupa", "Excel", "Google Sheets", "Outlook", "Gmail", "Slack", "Teams", "DocuSign", "SharePoint", "Word", "Jaggaer"],
  "vp-engineering": ["GitHub", "Slack", "Teams", "Jira", "Linear", "Google Docs", "Word", "Notion", "Confluence", "Zoom", "Lattice", "Datadog", "Google Sheets", "Excel", "Google Slides", "PowerPoint"],
  "vp-product": ["Notion", "Slack", "Teams", "Figma", "Google Slides", "PowerPoint", "Amplitude", "Mixpanel", "Linear", "Jira", "Zoom", "Miro", "Google Docs", "Word", "Productboard"],
  "vp-marketing": ["Google Slides", "PowerPoint", "HubSpot", "Marketo", "Slack", "Teams", "Google Analytics", "Notion", "Salesforce", "Zoom", "Tableau", "Power BI", "Figma", "Google Docs", "Word"],
  "vp-sales": ["Salesforce", "HubSpot", "Gong", "Clari", "Slack", "Teams", "Google Slides", "PowerPoint", "Zoom", "Google Docs", "Word", "Outreach", "Lattice", "Tableau", "Power BI"],
  "vp-finance": ["Excel", "NetSuite", "SAP", "Google Slides", "PowerPoint", "Slack", "Teams", "Tableau", "Power BI", "Adaptive Planning", "Anaplan", "Zoom", "Outlook", "Gmail"],
  "vp-operations": ["Google Sheets", "Excel", "Slack", "Teams", "Notion", "Asana", "Monday.com", "Salesforce", "Looker", "Power BI", "Zoom", "Google Docs", "Word", "Lattice"],
  "vp-people": ["Workday", "BambooHR", "Lattice", "Culture Amp", "15Five", "Slack", "Teams", "Google Docs", "Word", "Greenhouse", "Lever", "Google Slides", "PowerPoint", "Zoom"],
  "ceo": ["Google Docs", "Word", "Slack", "Teams", "Google Slides", "PowerPoint", "Notion", "Salesforce", "Zoom", "Gmail", "Outlook", "Tableau", "Power BI", "Lattice"],
  "cto": ["GitHub", "Slack", "Teams", "Linear", "Jira", "Notion", "Confluence", "Google Docs", "Word", "Datadog", "AWS Console", "Azure Portal", "Zoom", "Figma", "Google Slides", "PowerPoint"],
  "coo": ["Google Sheets", "Excel", "Slack", "Teams", "Notion", "Asana", "Monday.com", "Google Slides", "PowerPoint", "Salesforce", "Zoom", "Looker", "Power BI", "Lattice"],
  "cfo": ["Excel", "NetSuite", "SAP", "Google Slides", "PowerPoint", "Slack", "Teams", "Tableau", "Power BI", "Adaptive Planning", "Anaplan", "Zoom", "Outlook", "Gmail"],
  "cmo": ["Google Slides", "PowerPoint", "HubSpot", "Marketo", "Slack", "Teams", "Google Analytics", "Notion", "Figma", "Zoom", "Salesforce", "Tableau", "Power BI"],
  "cro": ["Salesforce", "HubSpot", "Gong", "Clari", "Slack", "Teams", "Google Slides", "PowerPoint", "Zoom", "Outreach", "SalesLoft", "Tableau", "Power BI"],
  "consultant": ["PowerPoint", "Google Slides", "Excel", "Google Sheets", "Google Docs", "Word", "Slack", "Teams", "Miro", "Notion", "Zoom", "Chrome", "Think-Cell", "Tableau"],
  "journalist": ["Google Docs", "Word", "Chrome", "Slack", "Signal", "Twitter/X", "Otter.ai", "Google Sheets", "Excel", "WordPress", "Substack", "Notion", "AP Stylebook"],
  "academic-researcher": ["Google Scholar", "Zotero", "Mendeley", "LaTeX", "Overleaf", "Google Docs", "Word", "Python", "R Studio", "SPSS", "Slack", "Zoom", "Excel", "Notion", "MATLAB"],
  "therapist-clinician": ["Epic", "Cerner", "SimplePractice", "TherapyNotes", "Google Docs", "Word", "Zoom", "Doxy.me", "Chrome", "Outlook", "Gmail", "Teams", "Excel"],
};

const situations = [
  { id: "monday-morning", label: "It's Monday morning", sub: "You just opened your laptop", icon: "☀" },
  { id: "post-meeting", label: "Just left a meeting", sub: "30-60 min away from your work", icon: "◷" },
  { id: "deep-interruption", label: "Got pulled into a fire", sub: "Unplanned, 15-30 min away", icon: "⚠" },
  { id: "quick-ping", label: "Quick Slack ping", sub: "Someone asked you a question", icon: "💬" },
];

function getRoleName(selectedRole: string | null, customRole: string): string {
  if (selectedRole === "other") return customRole || "Unknown";
  if (!selectedRole) return "Unknown";
  for (const cat of roleCategories) {
    const found = cat.roles.find((r) => r.id === selectedRole);
    if (found) return found.label;
  }
  return "Unknown";
}

export default function Demo() {
  const [step, setStep] = useState<"role" | "tools" | "situation" | "generating" | "result">("role");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [customRole, setCustomRole] = useState("");
  const [customTool, setCustomTool] = useState("");
  const [companyOrIndustry, setCompanyOrIndustry] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [card, setCard] = useState<CardType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSituation, setLastSituation] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  function handleRoleSelect(roleId: string) {
    setSelectedRole(roleId);
    const defaults = toolsByRole[roleId] || toolsByRole["business-ops"];
    setSelectedTools(defaults.slice(0, 4));
    setStep("tools");
  }

  function toggleTool(tool: string) {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }

  async function handleGenerate(situationId: string) {
    setStep("generating");
    setError(null);
    setLastSituation(situationId);

    const roleName = getRoleName(selectedRole, customRole);

    try {
      const context = companyOrIndustry ? `${roleName} at ${companyOrIndustry}` : roleName;
      const result = await generateCard(context, selectedTools, situationId);
      setCard(result);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("situation");
    }
  }

  async function handleFeedbackSubmit(feedbackData: FeedbackData) {
    setFeedbackSubmitted(true);

    const roleName = getRoleName(selectedRole, customRole);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleName,
          company: companyOrIndustry,
          tools: selectedTools,
          situation: lastSituation,
          ...feedbackData,
        }),
      });
    } catch (err) {
      console.error("Failed to save feedback:", err);
    }
  }

  function reset() {
    setStep("role");
    setSelectedRole(null);
    setExpandedCategory(null);
    setSelectedTools([]);
    setCompanyOrIndustry("");
    setCustomRole("");
    setCustomTool("");
    setCard(null);
    setLastSituation("");
    setFeedbackSubmitted(false);
    setError(null);
  }

  const availableTools = toolsByRole[selectedRole || "business-ops"] || toolsByRole["business-ops"];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>

      {/* Step 1: Company + Role */}
      {step === "role" && (
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text-primary)", marginBottom: 8, textAlign: "center" }}>
            Let's build your flow card
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, textAlign: "center", marginBottom: 28 }}>
            Tell us where you work, then pick your role.
          </p>

          <div style={{ marginBottom: 24 }}>
            <input type="text" value={companyOrIndustry} onChange={(e) => setCompanyOrIndustry(e.target.value)}
              placeholder="Company or industry (e.g. Stripe, Big 4, Series B healthtech)"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 10, border: "1px solid var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)", fontSize: 15, fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            />
            <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 6, paddingLeft: 4 }}>
              Optional, but makes the card dramatically more realistic
            </p>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 10, paddingLeft: 4 }}>Your role</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {roleCategories.map((cat) => (
              <div key={cat.category}>
                <button onClick={() => setExpandedCategory(expandedCategory === cat.category ? null : cat.category)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px", borderRadius: expandedCategory === cat.category ? "10px 10px 0 0" : 10,
                    cursor: "pointer", border: "1px solid",
                    borderColor: expandedCategory === cat.category ? "var(--accent)" : "var(--border)",
                    borderBottom: expandedCategory === cat.category ? "none" : "1px solid var(--border)",
                    backgroundColor: expandedCategory === cat.category ? "var(--accent-soft)" : "var(--bg-elevated)",
                    textAlign: "left", transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (expandedCategory !== cat.category) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.backgroundColor = "var(--accent-soft)"; } }}
                  onMouseLeave={(e) => { if (expandedCategory !== cat.category) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.backgroundColor = "var(--bg-elevated)"; } }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500, color: expandedCategory === cat.category ? "var(--accent)" : "var(--text-primary)" }}>{cat.category}</span>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)", transform: expandedCategory === cat.category ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>&#9654;</span>
                </button>
                {expandedCategory === cat.category && (
                  <div style={{ padding: "12px 14px", border: "1px solid var(--accent)", borderTop: "none", borderRadius: "0 0 10px 10px", backgroundColor: "var(--bg-elevated)", display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {cat.roles.map((role) => (
                      <button key={role.id} onClick={() => handleRoleSelect(role.id)}
                        style={{ padding: "8px 16px", borderRadius: 6, cursor: "pointer", border: "1px solid var(--border)", backgroundColor: "var(--bg)", fontSize: 13, fontWeight: 500, color: "var(--text-primary)", transition: "all 0.15s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                      >{role.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <input type="text" value={customRole} onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Don't see your role? Type it here"
              style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-body)", outline: "none" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              onKeyDown={(e) => { if (e.key === "Enter" && customRole.trim()) handleRoleSelect("other"); }}
            />
            <button onClick={() => { if (customRole.trim()) handleRoleSelect("other"); }} disabled={!customRole.trim()}
              style={{ padding: "12px 20px", borderRadius: 10, border: "none", cursor: customRole.trim() ? "pointer" : "default", backgroundColor: customRole.trim() ? "var(--text-primary)" : "var(--bg-subtle)", color: customRole.trim() ? "var(--bg)" : "var(--text-tertiary)", fontSize: 14, fontWeight: 600 }}
            >Go</button>
          </div>
        </div>
      )}

      {/* Step 2: Tools */}
      {step === "tools" && (
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text-primary)", marginBottom: 8, textAlign: "center" }}>What tools do you live in?</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, textAlign: "center", marginBottom: 28 }}>Tap the ones you use. This makes the card feel like yours.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
            {availableTools.map((tool) => {
              const selected = selectedTools.includes(tool);
              return (
                <button key={tool} onClick={() => toggleTool(tool)}
                  style={{ padding: "8px 16px", borderRadius: 20, cursor: "pointer", border: "1px solid", borderColor: selected ? "var(--accent)" : "var(--border)", backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elevated)", color: selected ? "var(--accent)" : "var(--text-secondary)", fontSize: 13, fontWeight: 500, transition: "all 0.15s ease" }}
                >{tool}</button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            <input type="text" value={customTool} onChange={(e) => setCustomTool(e.target.value)} placeholder="Add a tool we missed"
              style={{ flex: 1, padding: "8px 14px", borderRadius: 20, border: "1px solid var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-body)", outline: "none" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              onKeyDown={(e) => { if (e.key === "Enter" && customTool.trim()) { if (!selectedTools.includes(customTool.trim())) setSelectedTools([...selectedTools, customTool.trim()]); setCustomTool(""); } }}
            />
            <button onClick={() => { if (customTool.trim() && !selectedTools.includes(customTool.trim())) { setSelectedTools([...selectedTools, customTool.trim()]); setCustomTool(""); } }} disabled={!customTool.trim()}
              style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: customTool.trim() ? "pointer" : "default", backgroundColor: customTool.trim() ? "var(--text-primary)" : "var(--bg-subtle)", color: customTool.trim() ? "var(--bg)" : "var(--text-tertiary)", fontSize: 13, fontWeight: 600 }}
            >Add</button>
          </div>
          <button onClick={() => setStep("situation")}
            style={{ width: "100%", padding: "14px 20px", borderRadius: 10, border: "none", cursor: "pointer", backgroundColor: "var(--text-primary)", color: "var(--bg)", fontSize: 15, fontWeight: 600 }}
          >Continue</button>
          <button onClick={() => setStep("role")} style={{ width: "100%", padding: 10, marginTop: 8, background: "none", border: "none", color: "var(--text-tertiary)", fontSize: 13, cursor: "pointer" }}>Back</button>
        </div>
      )}

      {/* Step 3: Situation */}
      {step === "situation" && (
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, color: "var(--text-primary)", marginBottom: 8, textAlign: "center" }}>What just happened?</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, textAlign: "center", marginBottom: 32 }}>Pick a scenario. We'll generate your flow card.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {situations.map((sit) => (
              <button key={sit.id} onClick={() => handleGenerate(sit.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", borderRadius: 10, cursor: "pointer", border: "1px solid var(--border)", backgroundColor: "var(--bg-elevated)", textAlign: "left", transition: "all 0.15s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.backgroundColor = "var(--accent-soft)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.backgroundColor = "var(--bg-elevated)"; }}
              >
                <span style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{sit.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text-primary)", marginBottom: 2 }}>{sit.label}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{sit.sub}</div>
                </div>
              </button>
            ))}
          </div>
          {error && (
            <div style={{ marginTop: 16, padding: 14, borderRadius: 8, backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", color: "var(--error)", fontSize: 13 }}>{error}</div>
          )}
          <button onClick={() => setStep("tools")} style={{ width: "100%", padding: 10, marginTop: 12, background: "none", border: "none", color: "var(--text-tertiary)", fontSize: 13, cursor: "pointer" }}>Back</button>
        </div>
      )}

      {/* Generating */}
      {step === "generating" && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #3B82F6, #6366F1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 20, color: "#fff", fontWeight: 700, animation: "pulse 2s ease-in-out infinite" }}>P</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)", marginBottom: 8 }}>Building your flow card...</p>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>This takes about 20 seconds. We're synthesizing a realistic work context for your role.</p>
          <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }`}</style>
        </div>
      )}

      {/* Result */}
      {step === "result" && card && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", marginBottom: 20, borderRadius: 8, backgroundColor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <p style={{ fontSize: 12, color: "#6366F1", margin: 0, lineHeight: 1.45 }}>
              <strong>Demo only:</strong> Click the <span style={{ display: "inline-flex", width: 14, height: 14, borderRadius: "50%", backgroundColor: "rgba(99,102,241,0.2)", color: "#818CF8", fontSize: 8, fontWeight: 700, alignItems: "center", justifyContent: "center", verticalAlign: "middle" }}>?</span> icons to see how Phossil generates each section.
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <RecoveryCard data={card} showAnnotations={true} showFeedback={true} onFeedbackSubmit={handleFeedbackSubmit} />
          </div>

          {feedbackSubmitted && (
            <div style={{ textAlign: "center", padding: "20px 32px", marginBottom: 32, borderRadius: 12, border: "1px solid rgba(46,158,90,0.2)", backgroundColor: "var(--success-soft)" }}>
              <p style={{ color: "var(--success)", fontSize: 15, fontWeight: 500, margin: 0 }}>You're in. We'll be in touch soon.</p>
            </div>
          )}

          {/* Persistent escape hatch for high-intent visitors who skip feedback */}
          {!feedbackSubmitted && (
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <a href="https://calendar.app.google/685uNiinuYMrmzVTA" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--accent)", fontSize: 13, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
              >Want to skip the survey and just talk? Book a call.</a>
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <button onClick={reset} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid var(--border)", backgroundColor: "var(--bg-elevated)", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Try a different role</button>
          </div>
        </div>
      )}

    </div>
  );
}

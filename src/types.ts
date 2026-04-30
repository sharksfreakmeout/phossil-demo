export interface RecoveryCard {
    mode: "nudge" | "reconstruction" | "full_recovery";
    timeAway: string;
    semanticIntent: string;
    locus: {
      primary: string;
      detail?: string;
      state?: string;
    };
    progress?: ProgressItem[];
    deltas?: Delta[];
    connections?: Connection[];
    nextAction: string;
    ambient?: AmbientItem[];
  }
  
  export interface ProgressItem {
    label: string;
    status: "done" | "in-progress" | "todo";
    note?: string;
  }
  
  export interface Delta {
    severity: "critical" | "high" | "medium" | "low";
    source: string;
    content: string;
  }
  
  export interface Connection {
    label: string;
    text: string;
  }
  
  export interface AmbientItem {
    time: string;
    text: string;
  }
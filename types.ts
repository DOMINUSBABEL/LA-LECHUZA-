export enum AgentRole {
  G2 = 'G2_INTEL',
  G3 = 'G3_STRATEGY',
  G4 = 'G4_CREATIVE',
  G5 = 'G5_PR_RISK'
}

export interface HistoricalFigure {
  id: string;
  name: string;
  bio: string;
  tags: string[];
}

export interface AgentLog {
  id: string;
  agent: AgentRole;
  timestamp: Date;
  content: string;
  metadata?: any;
  isThinking?: boolean;
}

export interface MarketingAvatar {
  name: string;
  demographic: string;
  psychographic: string; // OCEAN profile summary
  painPoints: string[];
}

export interface CandidateAngle {
  name: string;
  tone: string;
  narrativeFocus: string;
  keyMessage: string;
}

export interface ViralPayload {
  hook: string;
  trigger: string;
  visualPrompt: string;
  format: 'Reel' | 'Carousel' | 'Thread' | 'Story';
  caption: string;
}

export interface StrategicMatrix {
  avatars: MarketingAvatar[];
  angles: CandidateAngle[];
  matches: { avatarIndex: number; angleIndex: number; score: number; rationale: string }[];
}
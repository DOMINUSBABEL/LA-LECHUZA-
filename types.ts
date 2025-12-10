export enum AgentRole {
  G2 = 'G2_CONTEXT',
  G3 = 'G3_DIFFUSION',
  G4 = 'G4_NARRATIVE',
  G5 = 'G5_CRITICAL'
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

export interface AudienceArchetype {
  name: string;
  culturalInterest: string; // Formerly demographic/psychographic mix
  sociologicalProfile: string; // OCEAN + Cultural Capital
  engagementBarriers: string[]; // Why they might not care initially
}

export interface NarrativeVoice {
  name: string;
  tone: string;
  pedagogicalApproach: string; // Formerly narrativeFocus
  coreValue: string; // Formerly keyMessage
}

export interface NarrativeArtifact {
  hook: string;
  educationalValue: string; // Formerly trigger
  visualConcept: string; // Formerly visualPrompt
  format: 'Micro-Documentary' | 'Digital Archive' | 'Narrative Thread' | 'Visual Essay';
  context: string; // Formerly caption
}

export interface StrategicMatrix {
  avatars: AudienceArchetype[];
  angles: NarrativeVoice[];
  matches: { avatarIndex: number; angleIndex: number; score: number; rationale: string }[];
}

// CRONOPOSTING TYPES

export interface CronoConfig {
  magicPrompt: string;
  duration: string;
  startDate: string;
  frequency: string;
  tone: string;
  contentMix: string;
  kpi: string;
  productionLevel: string;
  platforms: string[];
  formats: string[];
  strategicGoal: string;
}

export interface ScheduledPost {
  day: number;
  date: string;
  platform: string;
  format: string;
  concept: string;
  copyBrief: string;
  visualPrompt: string;
  objective: string;
}

export interface CronoSchedule {
  overview: string;
  posts: ScheduledPost[];
}
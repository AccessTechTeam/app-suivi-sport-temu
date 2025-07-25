export interface User {
  id: string;
  username: string;
  password?: string; // Should not be sent to client, but needed for creation
  isCoach: boolean;
  cumulativePenalty: number;
  createdAt: string;
}

export interface ActivityType {
  id: string;
  name: string;
  icon: string; // Emoji or icon identifier
}

export interface Activity {
  id: string;
  userId: string;
  activityTypeId: string;
  duration: number; // in minutes
  date: string;
  comment?: string;
}

export interface WeeklySummary {
  userId: string;
  username: string;
  totalMinutes: number;
  goalMet: boolean;
  status: 'achieved' | 'pending' | 'failed';
}

export interface AppSettings {
  weeklyGoalMinutes: number;
  penaltyAmount: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}


export type Page = 'login' | 'signup' | 'dashboard' | 'addActivity' | 'history';
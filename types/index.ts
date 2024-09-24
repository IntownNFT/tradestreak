export interface Project {
  id: string;
  name: string;
  trading_days_per_week: number;
  user_id: string;
}

export interface Task {
  id: string;
  content: string;
  project_id: string;
  completed: boolean;
  completed_date: string | null;
  user_id: string;
}

export type ActionState = {
  status: "success" | "error";
  message: string;
  data?: any;
};
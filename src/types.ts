export type TransactionType = "expense" | "income";

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name
  color: string; // hex
  type: TransactionType;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // always positive
  categoryId: string;
  description: string;
  date: string; // ISO date (yyyy-mm-dd)
  createdAt: number;
  updatedAt: number;
}

export interface Budget {
  categoryId: string;
  monthlyLimit: number;
}

export interface Profile {
  id: string;
  name: string;
  email?: string;
  currency: string; // e.g. BRL, USD, EUR
  avatarColor: string;
  avatarEmoji: string;
  monthlyIncomeGoal?: number;
  createdAt: number;
}

export type FontOptionKey =
  | "inter"
  | "roboto"
  | "poppins"
  | "nunito"
  | "montserrat"
  | "jetbrains-mono"
  | "merriweather"
  | "quicksand";

export interface ThemeSettings {
  mode: "dark" | "light";
  fontFamily: FontOptionKey;
  fontColor: string;
  mutedColor: string;
  bgColor: string;
  panelColor: string;
  panelAltColor: string;
  borderColor: string;
  accentColor: string;
  incomeColor: string;
  expenseColor: string;
  radius: number;
  toastBg: string;
  toastText: string;
  toastSuccess: string;
  toastError: string;
  toastWarning: string;
  toastInfo: string;
}

export interface AppSettings {
  id: "settings";
  theme: ThemeSettings;
  budgets: Budget[];
}

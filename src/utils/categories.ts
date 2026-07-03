import type { Category } from "../types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-food", name: "Alimentação", icon: "UtensilsCrossed", color: "#ff9f43", type: "expense", isDefault: true },
  { id: "cat-transport", name: "Transporte", icon: "Car", color: "#5b9dff", type: "expense", isDefault: true },
  { id: "cat-home", name: "Moradia", icon: "Home", color: "#a78bfa", type: "expense", isDefault: true },
  { id: "cat-health", name: "Saúde", icon: "HeartPulse", color: "#ff6b6b", type: "expense", isDefault: true },
  { id: "cat-education", name: "Educação", icon: "GraduationCap", color: "#38bdf8", type: "expense", isDefault: true },
  { id: "cat-leisure", name: "Lazer", icon: "PartyPopper", color: "#f472b6", type: "expense", isDefault: true },
  { id: "cat-shopping", name: "Compras", icon: "ShoppingBag", color: "#fbbf24", type: "expense", isDefault: true },
  { id: "cat-bills", name: "Contas", icon: "Receipt", color: "#94a3b8", type: "expense", isDefault: true },
  { id: "cat-subscriptions", name: "Assinaturas", icon: "Repeat", color: "#c084fc", type: "expense", isDefault: true },
  { id: "cat-pets", name: "Pets", icon: "PawPrint", color: "#fb923c", type: "expense", isDefault: true },
  { id: "cat-other-expense", name: "Outros", icon: "MoreHorizontal", color: "#9aa3c2", type: "expense", isDefault: true },

  { id: "cat-salary", name: "Salário", icon: "Wallet", color: "#57d98d", type: "income", isDefault: true },
  { id: "cat-freelance", name: "Freelance", icon: "Laptop", color: "#34d399", type: "income", isDefault: true },
  { id: "cat-investment", name: "Investimentos", icon: "TrendingUp", color: "#22d3ee", type: "income", isDefault: true },
  { id: "cat-gift", name: "Presente", icon: "Gift", color: "#f472b6", type: "income", isDefault: true },
  { id: "cat-other-income", name: "Outros", icon: "MoreHorizontal", color: "#9aa3c2", type: "income", isDefault: true },
];

export const CATEGORY_ICON_CHOICES = [
  "UtensilsCrossed", "Car", "Home", "HeartPulse", "GraduationCap", "PartyPopper",
  "ShoppingBag", "Receipt", "Repeat", "PawPrint", "Wallet", "Laptop", "TrendingUp",
  "Gift", "Plane", "Fuel", "Coffee", "Dumbbell", "Baby", "Shirt", "Smartphone",
  "Wrench", "Film", "Music", "BookOpen", "Bus", "Bike", "Gamepad2", "Scissors",
  "Landmark", "PiggyBank", "MoreHorizontal",
];

export const CATEGORY_COLOR_CHOICES = [
  "#ff9f43", "#5b9dff", "#a78bfa", "#ff6b6b", "#38bdf8", "#f472b6",
  "#fbbf24", "#94a3b8", "#c084fc", "#fb923c", "#57d98d", "#34d399",
  "#22d3ee", "#facc15", "#f87171", "#818cf8",
];

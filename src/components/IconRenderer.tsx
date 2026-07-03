import {
  UtensilsCrossed, Car, Home, HeartPulse, GraduationCap, PartyPopper,
  ShoppingBag, Receipt, Repeat, PawPrint, Wallet, Laptop, TrendingUp,
  Gift, Plane, Fuel, Coffee, Dumbbell, Baby, Shirt, Smartphone,
  Wrench, Film, Music, BookOpen, Bus, Bike, Gamepad2, Scissors,
  Landmark, PiggyBank, MoreHorizontal, HelpCircle,
  type LucideIcon, type LucideProps,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed, Car, Home, HeartPulse, GraduationCap, PartyPopper,
  ShoppingBag, Receipt, Repeat, PawPrint, Wallet, Laptop, TrendingUp,
  Gift, Plane, Fuel, Coffee, Dumbbell, Baby, Shirt, Smartphone,
  Wrench, Film, Music, BookOpen, Bus, Bike, Gamepad2, Scissors,
  Landmark, PiggyBank, MoreHorizontal,
};

export function IconRenderer({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICONS[name] ?? HelpCircle;
  return <Icon {...props} />;
}

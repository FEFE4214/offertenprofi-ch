import {
  PaintRoller,
  Zap,
  Droplets,
  Hammer,
  LayoutGrid,
  Home,
  Trees,
  Truck,
  Sparkles,
  Thermometer,
  CookingPot,
  Grid3x3,
  Wrench,
  DoorClosed,
  Building2,
  SunMedium,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  PaintRoller,
  Zap,
  Droplets,
  Hammer,
  LayoutGrid,
  Home,
  Trees,
  Truck,
  Sparkles,
  Thermometer,
  CookingPot,
  Grid3x3,
  Wrench,
  DoorClosed,
  Building2,
  SunMedium,
};

export default function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Wrench;
  return <Icon className={className} />;
}

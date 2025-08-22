import { Compass } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2" aria-label="CareerCompass AI">
      <Compass className="h-6 w-6 text-primary" />
      <span className="text-lg font-bold">CareerCompass AI</span>
    </div>
  );
}

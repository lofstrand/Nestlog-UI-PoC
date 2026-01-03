import React from "react";
import * as Icons from "lucide-react";

export const DynamicIcon: React.FC<{
  name: string;
  size?: number;
  className?: string;
}> = ({ name, size = 18, className = "" }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.HelpCircle size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
};


import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface AdminCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export const AdminCard = ({ title, description, icon, children }: AdminCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {icon}
      </div>
      {children}
    </Card>
  );
};
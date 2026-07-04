
import { ReactNode } from "react";

interface AdminPageHeaderProps {
    title: string;
    children?: ReactNode;
}

export const AdminPageHeader = ({ title, children }: AdminPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  );
};

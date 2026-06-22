
interface AdminPageHeaderProps {
  title: string;
}

export function AdminPageHeader({ title }: AdminPageHeaderProps) {
  return (
    <div className="border-b pb-4 mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

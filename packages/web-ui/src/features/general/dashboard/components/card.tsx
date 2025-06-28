import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface CardProps {
  title: string;
  value: number;
  description?: string;
  icon?: React.ReactNode;
}

export const HeaderCard = ({ title, value, description, icon }: CardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

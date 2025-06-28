import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SimpleTableProps {
  columns: any[];
  data: any[];
}

export function SimpleTable({ columns, data }: SimpleTableProps) {
  return (
    <div className="overflow-auto" style={{ maxHeight: 400 }}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map(item => (
              <TableRow key={item.id}>
                {columns.map(column => (
                  <TableCell key={column.key}>{item[column.key]}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

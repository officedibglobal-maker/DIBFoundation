
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

interface AdminDataTableProps {
  columns: string[];
  data: any[];
  actions?: (item: any) => ReactNode;
}

export default function AdminDataTable({ columns, data, actions }: AdminDataTableProps) {
  const formatCell = (cell: any) => {
    if (cell && typeof cell.toDate === 'function') {
      return cell.toDate().toLocaleString();
    }
    return cell;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
          {actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column}>{formatCell(row[column.toLowerCase()])}</TableCell>
            ))}
            {actions && <TableCell>{actions(row)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

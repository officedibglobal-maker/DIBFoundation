
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

// A column can be a simple string or an object with key and label
interface Column {
  key: string;
  label: string;
}

type ColumnType = string | Column;

interface AdminDataTableProps {
  columns: ColumnType[];
  data: any[];
  actions?: (item: any) => ReactNode;
}

export default function AdminDataTable({ columns, data, actions }: AdminDataTableProps) {
  const formatCell = (cell: any) => {
    if (cell && typeof cell.toDate === 'function') {
      return cell.toDate().toLocaleString();
    }
    if (typeof cell === 'boolean') {
      return cell ? 'Yes' : 'No';
    }
    if(typeof cell === 'number'){
        return cell;
    }
    return cell?.toString() || '-';
  };

  const getColumnKey = (column: ColumnType): string => {
    return typeof column === 'string' ? column : column.key;
  };

  const getColumnLabel = (column: ColumnType): string => {
    if (typeof column === 'string') {
        // convert camelCase to Title Case
        const result = column.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    }
    return column.label;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{getColumnLabel(column)}</TableHead>
            ))}
            {actions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.docId || row.id}>
                {columns.map((column, index) => (
                  <TableCell key={index}>{formatCell(row[getColumnKey(column)])}</TableCell>
                ))}
                {actions && <TableCell className="text-right">{actions(row)}</TableCell>}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function QueryHistory({ history }) {
  if (history.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Historial de Consultas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Palabras clave encontradas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((q, i) => (
            <TableRow key={i}>
              <TableCell>{q.url}</TableCell>
              <TableCell>{q.timestamp}</TableCell>
              <TableCell>{q.keywordsFound}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

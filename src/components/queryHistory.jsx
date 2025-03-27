import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import mockData from "../lib/mockData.json";

export default function QueryHistory() {
  const [history] = useState(mockData.queryHistoryData); // Set initial data

  if (history.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Historial de Consultas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Campaña</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((q, i) => (
            <TableRow key={i}>
              <TableCell>{q.timestamp}</TableCell>
              <TableCell>{q.campaignName}</TableCell>
              <TableCell>{q.email}</TableCell>
              <TableCell>{q.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

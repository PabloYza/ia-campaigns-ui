import React from "react";

export default function GenerateCSV({ file }) {
  if (!file) return null;
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Archivo Generado</h2>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="text-blue-600 hover:underline"
      >
        {file.name}
      </a>
    </div>
  );
}

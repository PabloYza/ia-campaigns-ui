import React from "react";
import mockData from "../lib/mockData.json"; // Adjust the path if needed

// Destructure the copies
const initialCopies = mockData.copyData;

export default function GenerateCSV({ copies, campaignName }) {
  const handleDownload = () => {
    if (!initialCopies || initialCopies.length === 0) return;

    const headers = ["id", "title", "body"];
    const rows = initialCopies.map(copy =>
      [copy.id, `"${copy.title}"`, `"${copy.body}"`].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${campaignName || "campaña"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Generar CSV
      </button>
    </div>
  );
}
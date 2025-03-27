import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import mockData from "../lib/mockData.json";

const initialCopies = mockData.copyData;

function CopyCard({ copy, onChange, onSave }) {
  return (
    <div className="border rounded-md p-4 space-y-2">
      <Input
        value={copy.title}
        onChange={(e) => onChange(copy.id, "title", e.target.value)}
        placeholder="Título del anuncio"
      />
      <Textarea
        value={copy.body}
        onChange={(e) => onChange(copy.id, "body", e.target.value)}
        placeholder="Descripción del anuncio"
      />
      <Button
        onClick={() => onSave(copy.id)}
        variant={copy.saved ? "outline" : "default"}
      >
        {copy.saved ? "Guardado" : "Guardar"}
      </Button>
    </div>
  );
}

export default function CopySection() {
  const [copies, setCopies] = useState(
    initialCopies.map((c) => ({ ...c, saved: false }))
  );

  const handleChange = (id, field, value) => {
    setCopies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, [field]: value, saved: false } : c
      )
    );
  };

  const handleSave = (id) => {
    setCopies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, saved: true } : c))
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {copies.map((copy) => (
        <CopyCard
          key={copy.id}
          copy={copy}
          onChange={handleChange}
          onSave={handleSave}
        />
      ))}
    </div>
  );
}



















/* import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import mockData from "../lib/mockData.json"; 

const copies = mockData.copies; // Use the mock data

export default function CopyCard({ copy, onChange, onSave }) {
  return (
    <div className="border rounded-md p-4 space-y-2">
      <Input
        value={copy.title}
        onChange={(e) => onChange(copy.id, "title", e.target.value)}
        placeholder="Título del anuncio"
      />
      <Textarea
        value={copy.body}
        onChange={(e) => onChange(copy.id, "body", e.target.value)}
        placeholder="Descripción del anuncio"
      />
      <Button onClick={() => onSave(copy.id)} variant={copy.saved ? "outline" : "default"}>
        {copy.saved ? "Guardado" : "Guardar"}
      </Button>
    </div>
  );
}
 */

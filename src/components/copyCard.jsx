import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

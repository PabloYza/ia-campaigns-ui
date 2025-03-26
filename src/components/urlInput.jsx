import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UrlInput({ url, setUrl, onGenerate, isLoading }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="font-medium">URL del sitio web</label>
        <Input
          type="text"
          placeholder="https://ejemplo.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <Button onClick={onGenerate} disabled={isLoading || !url}>
        {isLoading ? "Procesando..." : "Generar campaña"}
      </Button>
    </div>
  );
}
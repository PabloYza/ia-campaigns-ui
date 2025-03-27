import React, {useState} from "react";
import UrlInput from "../components/UrlInput";
import GenerateCsv from "../components/GenerateCsv";
import CopyCard from "../components/CopyCard";
import QueryHistory from "../components/QueryHistory";

function CampaignTool() {
  const [url, setUrl] = useState("");
  const [clientName, setClientName] = useState("");

  const handleGenerate = () => {
    if (!url) return;

    try {
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
      const domain = new URL(normalizedUrl).hostname.replace(/^www\./, "").split(".")[0];
      setClientName(domain); // 👈 save client name
      console.log("Client name extracted:", domain);
      // trigger OpenAI or SEMrush logic here...
    } catch (error) {
      console.error("Invalid URL format");
    }
  };


  return (
    <div>
      <h1>Campaign Tool</h1>
      <UrlInput url={url}
        setUrl={setUrl}
        onGenerate={handleGenerate}
        isLoading={false} 
        clientName={clientName}
        />
      <CopyCard />
      <QueryHistory /> 
      <GenerateCsv campaignName={clientName}/>
    </div>
  );
}
export default CampaignTool;
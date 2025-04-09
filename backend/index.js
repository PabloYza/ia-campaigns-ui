import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import campaignRoutes from "./routes/campaigns.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("IA Campaigns backend is running ✅");
});

app.use("/campaigns", campaignRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

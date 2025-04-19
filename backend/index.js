import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import campaignRoutes from "./routes/campaigns.js";
import clientRoutes from './routes/clients.js';
import openaiRoutes from './routes/generate-keywords.js';
import googleAuthRoutes from './routes/googleAuth.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
	res.send("IA Campaigns backend is running ✅");
});

app.use("/campaigns", campaignRoutes);
app.use('/clients', clientRoutes);
app.use('/generate-keywords', openaiRoutes);
app.use('/google-auth', googleAuthRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

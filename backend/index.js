import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import campaignRoutes from "./routes/campaigns.js";
import clientRoutes from './routes/clients.js';
import openaiRoutes from './routes/generateKeywords.js';
import googleAuthRoutes from './routes/googleAuth.js';
import semrushRoutes from './routes/semrush.js';
import generateCopiesRoute from './routes/generateCopies.js';

dotenv.config();
const app = express();
app.use(cors({ origin: "*" }))
app.use(express.json());


app.get("/", (req, res) => {
	res.send("IA Campaigns backend is running ✅");
});

app.use("/campaigns", campaignRoutes);
app.use('/clients', clientRoutes);
app.use('/generateKeywords', openaiRoutes);
app.use('/generateCopies', generateCopiesRoute);
app.use('/google-auth', googleAuthRoutes);
app.use('/semrush', semrushRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

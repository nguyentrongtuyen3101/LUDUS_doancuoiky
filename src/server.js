import app from "./app.js";
import dotenv from "dotenv";
import { cleanUploads } from "./utils/cleanUploads.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  await cleanUploads();
  app.listen(PORT, () => {
    console.log(`🇻🇳 Server running at http://localhost:${PORT}`);
  });
}
startServer();
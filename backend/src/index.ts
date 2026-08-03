import dotenv from "dotenv";
import app from "./app";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 StudySprint AI Server running on port ${PORT}`);
});

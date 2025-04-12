import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import patientRoutes from "./routes/patient.route.js";
import cors from "cors";  // Import cors


dotenv.config();

const app = express();

// Enable CORS
app.use(cors()); // This will allow all domains by default, which is fine for development

app.use(express.json()); // middleware (a function that runs before we send the response back to the client) 
// that allows us to accept json data in the req.body

app.use("/api/patients", patientRoutes);

app.get("/", (req, res) => {
  res.send("server is ready");
});

// Using process.env.PORT for the port
const port = process.env.PORT || 5001;

app.listen(port, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${port}`);
});

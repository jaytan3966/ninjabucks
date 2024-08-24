import express from "express";
import cors from "cors";
import ninjas from "./routes/records.js";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({ origin: 'https://ninjabucksdashboard-fjcn.onrender.com' }));
app.use(express.json());
app.use("/records", ninjas);

app.listen(PORT, '0.0.0.0', () =>{
    console.log(`Server is running on port ${PORT}`)
})
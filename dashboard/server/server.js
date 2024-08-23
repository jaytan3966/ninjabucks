import express from "express";
import cors from "cors";
import ninjas from "./routes/records.js";

const PORT = process.env.PORT || 8080;
const app = express();

// { origin: 'https://ninjabucksdashboard-fjcn.onrender.com' }
app.use(cors());
app.use(express.json());
app.use("/records", ninjas);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})
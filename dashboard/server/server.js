import express from "express";
import cors from "cors";
import ninjas from "./routes/records.js";

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/records", ninjas);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})
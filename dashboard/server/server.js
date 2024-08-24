import express from "express";
import cors from "cors";
import ninjas from "./routes/records.js";
import { MongoClient, ServerApiVersion } from "mongodb";

const PORT = process.env.PORT || 3001;
const uri = process.env.ATLAS_URI;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/records", ninjas);

let db;
async function startServer() {
    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        await client.connect();
        db = client.db("ninjabalances");
        await client.db("ninjabalances").command({ ping: 1 });
        console.log("Pinged your deployment. Successfully connected to MongoDB!");

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

startServer();

export default db;
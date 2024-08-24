// import express from "express";
// import cors from "cors";
// import ninjas from "./routes/records.js";

// const PORT = process.env.PORT || 3001;
// const app = express();

// app.use(cors({ origin: 'https://ninjabucksdashboard-fjcn.onrender.com' }));
// app.use(express.json());
// app.use("/records", ninjas);

// app.listen(PORT, '0.0.0.0', () =>{
//     console.log(`Server is running on port ${PORT}`)
// })

import express from "express";
import cors from "cors";
import ninjas from "./routes/records.js";
import { MongoClient, ServerApiVersion } from "mongodb";

const PORT = process.env.PORT || 8080;
const uri = process.env.ATLAS_URI;

const app = express();

app.use(cors({ origin: 'https://ninjabucksdashboard-fjcn.onrender.com' }));
app.use(express.json());
app.use("/records", ninjas);

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

let db = client.db("ninjabalances");

export default db;
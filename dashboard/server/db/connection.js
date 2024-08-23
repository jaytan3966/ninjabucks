import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsVersion: 'TLSv1.2',
})

async function connectToDataBase(){
    try {
        await client.connect();
        await client.db("ninjabalances").command({ping:1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error(err);
    }
}

connectToDataBase();

let db = client.db("ninjabalances");

export default db;
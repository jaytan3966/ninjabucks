import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    tlsAllowInvalidCertificates: false,
    tlsVersion: 'TLSv1.2',
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
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
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect().then(() => {
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return client;
  });
}

clientPromise = global._mongoClientPromise;

export default clientPromise;

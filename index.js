const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://taskDB:m2EB8NqlNUJQmNTm@cluster0.kam1qyh.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db("dbData");
    const collection = db.collection("formData");
    // get all data
    const cursor = collection.find({});
    const results = await cursor.toArray();
    console.log(results);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Server Running");
});

// get formData api
app.get("/formData", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("dbData");
    const collection = db.collection("formData");
    // get all data
    const cursor = collection.find({});
    const results = await cursor.toArray();
    res.send(results);
  } catch (error) {
    console.log(error);
  }
});

// post formData to users api (Name,Sectors,AgreeToTerms)
app.post("/user", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("userDB");
    const collection = db.collection("userData");
    const data = req.body;
    const result = await collection.insertOne(data);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server Running`);
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

// Get User
app.get("/user", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("userDB");
    const collection = db.collection("userData");
    // get all data
    const cursor = collection.find({});
    const results = await cursor.toArray();
    res.send(results);
  } catch (error) {
    console.log(error);
  }
});

// Get User by ID
app.get("/user/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("userDB");
    const collection = db.collection("userData");
    // update user
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const user = await collection.findOne(query);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// PUT user info
app.put("/user/:id", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("userDB");
    const collection = db.collection("userData");
    // update user
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    console.log(req.body);
    const option = {
      upsert: true,
    };
    const updatedUser = {
      $set: {
        name: req.body.name,
        selectors: req.body.selectors,
        agreeToTerms: req.body.agreeToTerms,
      },
    };
    const result = await collection.updateOne(query, updatedUser, option);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server Running`);
});

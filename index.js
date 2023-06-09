const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://admin:admin@cluster0.9m4kwkt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const tasksCollection = client.db("taskManagerV2").collection("tasks");

    app.post("/task", async (req, res) => {
      const body = req.body;
      const result = await tasksCollection.insertOne(body);
      res.send(result);
    });
    app.get("/taska", async (req, res) => {
      const query = {};
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = { userEmail: email };
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });
    app.put("/donetask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          done: true,
        },
      };
      const result = await tasksCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });
    app.put("/addComments/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          comments: body.comment,
        },
      };
      const result = await tasksCollection.updateOne(query, updateDoc, option);
      res.send(result);
    });
    app.put("/edittask/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = {
        _id: ObjectId(id),
      };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          title: body.title,
          details: body.details,
          image: body.image,
        },
      };

      const result = await tasksCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    app.put("/notcompletetask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          done: false,
        },
      };
      const result = await tasksCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: ObjectId(id),
      };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Heloo World");
});
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

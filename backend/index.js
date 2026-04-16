require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = "mongodb+srv://biyeghor:biyeghor@cluster0.xfvkq.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("biyeghor");
    const usersCollection = db.collection("users");
    const profilesCollection = db.collection("profiles");
    const complaintsCollection = db.collection("complaints");

    app.get("/dashboard-stats", async (req, res) => {
      try {
        const [usersCount, profilesCount, complaintsCount] =
          await Promise.all([
            usersCollection.countDocuments(),
            profilesCollection.countDocuments(),
            complaintsCollection.countDocuments(),
          
          ]);

        res.status(200).json({
          usersCount,
          profilesCount,
          complaintsCount,
          
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching stats" });
      }
    });

  app.post("/users", async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result)
  })
  app.get("/users", async(req,res)=>{
      const result = await usersCollection.find().toArray();
      res.send(result)
  })

  app.delete("/users/:id", async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result)
  });
  app.patch("/users/:id", async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = req.body;
      const user = {
        $set: {
           ...update
        },
      };
      const result = await usersCollection.updateOne(query,user);   
      res.send(result)
  });

  // Complain api's
  app.post("/complaints", async(req,res)=>{
      const complaint = req.body;
      const result = await complaintsCollection.insertOne(complaint);
      res.send(result)
  })
  app.get("/complaints", async(req,res)=>{
      const result = await complaintsCollection.find().toArray();
      res.send(result)
  })

  app.delete("/complaints/:id", async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await complaintsCollection.deleteOne(query);
      res.send(result)
  });
  app.patch("/complaints/:id", async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = req.body;
      const complaint = {
        $set: {
           ...update
        },
      };
      const result = await usersCollection.updateOne(query,user);   
      res.send(result)
  })

  //  Profiles api
    app.post("/profiles", async (req, res) => {
      const profile = req.body;
      const result = await profilesCollection.insertOne(profile);
      res.send(result);
    });

    app.get("/profiles", async (req, res) => {
      const result = await profilesCollection.find().toArray();
      res.send(result);
    });
    app.get("/profiles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await profilesCollection.findOne(query);
      res.send(result);
    });

    app.delete("/profiles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await profilesCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/profiles/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateProfile = req.body;
      const profile = {
        $set: {
           ...updateProfile
        },
      };

        const result = await profilesCollection.updateOne(filter,profile)
        res.send(result);
    });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// API Routes
app.get("/", (req, res) => {
  res.send("BiyeGhor API Running...");
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
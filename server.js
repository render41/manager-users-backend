const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
require("dotenv").config;

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

const addressHttp = `http://localhost:${port}`;
const addressFront = `http://localhost:5173`;

app.use(cors({ origin: addressFront }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("<h1>Congrats, you connected!</h1>");
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in server.");
  }
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in server.");
  }
});

app.listen(port, () => {
  console.log(`Server is running in: ${addressHttp}`);
  console.log(`Front-End is running in: ${addressFront}`);
});

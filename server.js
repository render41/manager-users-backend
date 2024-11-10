const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

const addressHttp = `http://localhost:${port}`;
const addressFront = `http://localhost:5173`;

// Usar uma instância única do Prisma no Vercel em produção
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

app.use(cors({ origin: addressFront }));
app.use(express.json());

// Rota para verificar se a conexão está funcionando
app.get("/", async (req, res) => {
  res.send("<h1>Congrats, you connected!</h1>");
});

// Rota para obter todos os usuários
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in server.");
  }
});

// Rota para criar um novo usuário
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

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server is running in: ${addressHttp}`);
});

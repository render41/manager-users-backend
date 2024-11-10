const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

const addressHttp = `http://localhost:${port}`;
const addressFront = process.env.FRONTEND_URL || `http://localhost:5173`; // Frontend URL configurada

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

// Log de erros de conexão com o Prisma
async function checkPrismaConnection() {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
}

checkPrismaConnection();

// Configuração de CORS (permitir cookies)
app.use(
  cors({
    origin: addressFront, // Permitindo o frontend específico
    credentials: true, // Permitir envio de cookies
  })
);

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
    console.error("Erro ao buscar usuários:", error);
    res.status(500).send("Erro no servidor.");
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
    console.error("Erro ao criar usuário:", error);
    res.status(500).send("Erro no servidor.");
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server is running in: ${addressHttp}`);
});

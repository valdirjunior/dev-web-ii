const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(cors());

// Armazenamento de mensagens e clientes
let pollingMessages = [];
let longPollingMessages = [];
let pendingLongPollingResponses = [];
let websocketClients = new Set();

// HTTP Polling
app.get("/polling", (req, res) => {
  if (pollingMessages.length > 0) {
    const message = pollingMessages[pollingMessages.length - 1]; // Última mensagem
    console.log(`[HTTP Polling] Enviando mensagem: "${message}"`);
    res.json({ message });
    pollingMessages = [];
  } else {
    res.json({ message: null });
  }
});

app.post("/polling/send", (req, res) => {
  const message = req.body.message;
  if (message) {
    pollingMessages.push(message);
    console.log(`[HTTP Polling] Mensagem recebida: "${message}"`);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// Long Polling
app.get("/long-polling", (req, res) => {
  if (longPollingMessages.length > 0) {
    const message = longPollingMessages[longPollingMessages.length - 1];
    console.log(`[Long Polling] Enviando mensagem: "${message}"`);
    res.json({ message });
    longPollingMessages = [];
  } else {
    pendingLongPollingResponses.push(res);
    setTimeout(() => {
      const index = pendingLongPollingResponses.indexOf(res);
      if (index !== -1) {
        // Remove a resposta da lista de pendentes
        pendingLongPollingResponses.splice(index, 1);
        res.json({ message: null });
      }
    }, 30000); // Timeout de 30 segundos
  }
});

app.post("/long-polling/send", (req, res) => {
  const message = req.body.message;
  if (message) {
    longPollingMessages.push(message);
    console.log(`[Long Polling] Mensagem recebida: "${message}"`);
    // Envia para todos os clientes aguardando
    while (pendingLongPollingResponses.length > 0) {
      const response = pendingLongPollingResponses.shift();
      response.json({ message });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// WebSocket
wss.on("connection", (ws) => {
  console.log("[WebSocket] Cliente conectado");
  websocketClients.add(ws);

  ws.on("message", (data) => {
    const parsed = JSON.parse(data);
    const message = parsed.message;
    console.log(`[WebSocket] Mensagem recebida: "${message}"`);
    // Envia a mensagem para todos os clientes conectados
    websocketClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ message }));
      }
    });
  });

  ws.on("close", () => {
    console.log("[WebSocket] Cliente desconectado");
    websocketClients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("[WebSocket] Erro:", error);
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
  console.log("📡 HTTP Polling: Verifica mensagens a cada 2 segundos.");
  console.log("⏳ Long Polling: Aguarda mensagens de qualquer cliente.");
  console.log("🔗 WebSocket: Comunicação em tempo real entre clientes.");
});

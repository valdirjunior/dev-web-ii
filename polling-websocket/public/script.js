let pollingInterval;
let longPollingActive = false;
let ws;

// Polling: verifica mensagens enviadas por qualquer cliente
(function startPolling() {
  pollingInterval = setInterval(async () => {
    try {
      const response = await fetch("http://localhost:3000/polling");
      const data = await response.json();
      if (data.message) {
        document.getElementById("polling-messages").innerText = data.message;
        console.log(`[Polling] Mensagem recebida: "${data.message}"`);
      }
    } catch (error) {
      console.error("[Polling] Erro ao buscar mensagem:", error);
    }
  }, 2000);
  console.log("Polling iniciado automaticamente.");
})();

async function sendPollingMessage() {
  const input = document.getElementById("polling-input");
  const message = input.value.trim();
  if (!message) return;
  input.value = "";
  try {
    await fetch("http://localhost:3000/polling/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    document.getElementById("polling-messages").innerText = message; // Atualiza localmente
    console.log(`[Polling] Mensagem enviada: "${message}"`);
  } catch (error) {
    console.error("[Polling] Erro ao enviar mensagem:", error);
  }
}
// Long Polling: espera por mensagens de qualquer cliente
(function startLongPolling() {
  longPollingActive = true; // Flag para controlar o estado do Long Polling
  console.log("Long Polling iniciado automaticamente.");

  // Função recursiva que faz as requisições
  const poll = async () => {
    // Verifica se o Long Polling deve continuar ativo
    if (!longPollingActive) return;

    try {
      // Faz a requisição ao endpoint /long-polling com timeout de 30 segundos
      const response = await fetch("http://localhost:3000/long-polling", { timeout: 30000 });
      if (response.ok) {
        const data = await response.json(); // Converte a resposta em JSON
        if (data.message) {
          // Atualiza o DOM com a mensagem recebida
          document.getElementById("long-polling-messages").innerText =
            data.message;
          console.log(`[Long Polling] Mensagem recebida: "${data.message}"`);
        }
      }
    } catch (error) {
      // Trata erros como timeout ou falha de rede
      console.error("[Long Polling] Erro:", error);
    }

    // Reinicia a requisição imediatamente após a resposta ou erro
    if (longPollingActive) {
      poll();
    }
  };

  // Inicia o ciclo de Long Polling
  poll();
})();

// Função para enviar mensagens
async function sendLongPollingMessage() {
  const input = document.getElementById("long-polling-input");
  const message = input.value.trim();
  if (!message) return; // Ignora mensagens vazias
  input.value = ""; // Limpa o campo de entrada

  try {
    // Envia a mensagem ao servidor via POST
    await fetch("http://localhost:3000/long-polling/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    // Atualiza o DOM localmente para feedback imediato
    document.getElementById("long-polling-messages").innerText = message;
    console.log(`[Long Polling] Mensagem enviada: "${message}"`);
  } catch (error) {
    console.error("[Long Polling] Erro ao enviar mensagem:", error);
  }
}

// WebSocket: controle manual de conexão
function startWebSocket() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log("WebSocket já está conectado.");
    return;
  }

  ws = new WebSocket("ws://localhost:3000");
  ws.onopen = () => {
    console.log("Conexão WebSocket iniciada.");
    document.getElementById("websocket-messages").innerText =
      "Conexão estabelecida!";
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    document.getElementById("websocket-messages").innerText = data.message;
    console.log(`[WebSocket] Mensagem recebida: "${data.message}"`);
  };
  ws.onerror = (error) => {
    console.error("[WebSocket] Erro:", error);
    document.getElementById("websocket-messages").innerText =
      "Erro na conexão!";
  };
  ws.onclose = () => {
    console.log("Conexão WebSocket fechada.");
    document.getElementById("websocket-messages").innerText =
      "Conexão fechada.";
  };
}

function stopWebSocket() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
    console.log("Conexão WebSocket fechada manualmente.");
  } else {
    console.log("Nenhuma conexão WebSocket ativa para fechar.");
  }
}

function sendWebSocketMessage() {
  const input = document.getElementById("websocket-input");
  const message = input.value.trim();
  if (!message) return;
  input.value = "";

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ message }));
    document.getElementById("websocket-messages").innerText = message; // Atualiza localmente
    console.log(`[WebSocket] Mensagem enviada: "${message}"`);
  } else {
    console.warn("WebSocket não está conectado.");
    document.getElementById("websocket-messages").innerText =
      "Erro: WebSocket não conectado!";
  }
}

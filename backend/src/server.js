require('dotenv').config();
const http = require('http');
const app = require('./app.js');
const WebSocket = require('ws');

const server = http.createServer(app); // Create HTTP server
const wss = new WebSocket.Server({ server }); // Attach WebSocket server to HTTP

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Handle messages from the client
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast message to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Echo: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3010, () => {
  console.log(`Server Running on port 3010`);
  console.log('API Testing UI: http://localhost:3010/v0/api-docs/');
});

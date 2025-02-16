require('dotenv').config();
const http = require('http');
const app = require('./app.js');
const WebSocket = require('ws');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map(); // Stores connected clients and their names

wss.on('connection', (ws) => {
    const clientId = `User-${Math.floor(Math.random() * 1000)}`; // Default user ID
    clients.set(ws, clientId);
    console.log(`New client connected: ${clientId}`);

    // Send welcome message with default name
    ws.send(`Welcome, ${clientId}! Type /name newName to change your name.`);

    ws.on('message', (message) => {
        message = message.toString().trim(); // Convert Buffer to String and trim whitespace

        if (message.startsWith("/name ")) {
            const newName = message.split(" ")[1];
            if (newName) {
                clients.set(ws, newName); // Update the user's name
                ws.send(`Your name is now ${newName}`);
                console.log(`Client renamed to: ${newName}`);
                return;
            }
        }

        // Broadcast message with sender's name
        const senderName = clients.get(ws);
        console.log(`[${senderName}] Sent: ${message}`);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`[${senderName}]: ${message}`);
            }
        });
    });

    ws.on('close', () => {
        console.log(`Client disconnected: ${clients.get(ws)}`);
        clients.delete(ws);
    });
});

server.listen(3010, () => {
    console.log(`Server Running on port 3010`);
});

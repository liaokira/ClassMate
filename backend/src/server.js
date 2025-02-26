require('dotenv').config();
const http = require('http');
const app = require('./app.js');
const WebSocket = require('ws');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'db',
    port: '5432',
    database: 'example',
    user: 'postgres',
    password: 'test',
});


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map(); // Stores connected clients and their names

wss.on('connection', (ws) => {
    console.log('New client connected');

    // Handle client messages
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'join') {
                // Store user in the group
                clients.set(ws, { userId: data.userId, groupId: data.groupId, sender_name: data.sender_name});
                console.log(`User ${data.sender_name} joined group ${data.groupId}`);
            } else if (data.type === 'message') {
                // Save message to the database
                const result = await pool.query(
                    `INSERT INTO messages (sender_id, sender_name, group_id, message) VALUES ($1, $2, $3, $4) RETURNING *;`,
                    [data.senderId, data.sender_name, data.groupId, data.message]
                );

                const savedMessage = result.rows[0];

                // Broadcast message to all users in the same group
                broadcastToGroup(data.groupId, savedMessage);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

function broadcastToGroup(groupId, message) {
    clients.forEach((clientData, clientWs) => {
        if (clientData.groupId === groupId && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'message', message }));
        }
    });
}

server.listen(3010, () => {
    console.log(`Server Running on port 3010`);
});

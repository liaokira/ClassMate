// backend/src/index.js

/***
 * Import required libraries
 */
const express = require('express'); 
const cors = require ('cors'); 
const http = require('http');
const { Server } = require('socket.io'); 

/***
 * Create an Express app instance
 */
const app = express(); 

/***
 * Create an HTTP server from the Express app
 */
const server = http.createServer(app); 

/***
 * Create a Socket.IO server, attaching it to the HTTP server
 */
const io = new Server(server, {
    cors: {
        origin: '*', 
    },
});

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Hello from the ClassMate backend!'); 
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000; 
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

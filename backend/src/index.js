// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*', // or "http://localhost:5173" if you want to be specific
//   },
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test route
// app.get('/', (req, res) => {
//   res.send('Hello from ClassMate backend (JS)!');
// });

// // Socket.IO
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// const PORT = process.env.PORT || 4000;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

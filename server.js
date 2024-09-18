const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const disasterRoutes = require('./routes/disasterRoutes');

const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.use('/', disasterRoutes(io));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
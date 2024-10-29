const { Server } = require('socket.io');

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Ajuste se necessário para sua aplicação
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado ao Socket.io');

    socket.on('disconnect', () => {
      console.log('Cliente desconectado do Socket.io');
    });
  });

  return io;
}

module.exports = setupSocketIO;

const mineflayer = require('mineflayer');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let firstJoin = true;

const bot = mineflayer.createBot({
  host: 'jogar.redemaster.net',
  port: 25565,
  username: 'tutuerick10play2',
  version: '1.8.9'
});

bot.on('spawn', () => {
  console.log('✅ Bot entrou no servidor!');
  setTimeout(() => {
    if (firstJoin) {
      bot.chat('/register games111 games111');
      firstJoin = false;
    } else {
      bot.chat('/login games111');
    }
  }, 5000);
});

app.use(express.static('public'));

let humanChat = [];

io.on('connection', (socket) => {
  console.log('🟢 Cliente conectado');

  socket.on('command', (msg) => {
    if (msg.startsWith('/')) {
      bot.chat(msg);
    } else if (msg.startsWith('andar')) {
      const blocks = parseInt(msg.split(' ')[1] || '1');
      bot.setControlState('forward', true);
      setTimeout(() => bot.setControlState('forward', false), blocks * 1000);
    } else if (msg === 'pular') {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    } else {
      bot.chat(msg);
    }
  });

  socket.on('humanchat', (txt) => {
    humanChat.push(txt);
    io.emit('humanchat', txt);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('🌐 Painel disponível em http://localhost:' + (process.env.PORT || 3000));
});

const { Client, Location, List, Buttons, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const express = require('express');
//const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }});
const app = express();
const socketIO = require('socket.io');
const port = 8080
const path = require('path')
const http = require('http')


const server = http.createServer(app);
const io = socketIO(server);

 app.get('/', (req, res) => {
    res.sendFile('index.html', {root : __dirname});
 });

  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })



client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});



client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});
client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    } else if (msg.body == 'good morning'){
        msg.reply('selamat pagi');
    }
});
client.on('message', msg => {
   if (msg.body == 'p'){
        msg.reply('pp');
   }
});

client.on('message', async (msg) => {
   if (msg.body.startsWith('!sticker') && msg.type == 'image'){
    const media = await msg.downloadMedia();
    client.sendMessage(msg.from, media, {
        sendMediaAsSticker: true,
        stickerName:'botsticker',
        stickerAuthor:'byrafi'
        
    })
   }
});
client.on('message', async (msg) => {
   if (msg.body.startsWith('!document') && msg.type == 'image'){
    const media = await msg.downloadMedia();
    client.sendMessage(msg.from, media, {
        sendMediaAsDocument: true,
    })
   }
});




io.on('connection', function(socket){
    socket.emit('message', 'connecting...');
    console.log('connecting');

    client.on('qr', (qr) => {
        console.log('QR RECEIVED' , qr);
    
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit('qr', url);
            socket.emit('message', 'qr code resived,scan')
        });
    });
    client.on('ready', () => {
        console.log('READY');
        socket.emit('message', 'qr code resived,ready')
    });
});

client.initialize();

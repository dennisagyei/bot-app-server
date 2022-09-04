var botui = new BotUI('api-bot');
//var socket = io.connect('http://localhost:8010');
var socket = io();

botui.message.add({
  content: 'Hello There!'
}).then(function () { // wait till its shown
  botui.message.add({ // show next message
    content: 'How are you?'
  });
});
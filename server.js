// ------------- SETTINGS
const projectId = process.env.npm_config_PROJECT_ID;
const example = process.env.npm_config_EXAMPLE;
const port = ( process.env.npm_config_PORT || 3000 );

const languageCode = 'en-IN';
let encoding = 'LINEAR16';

const singleUtterance = true;
const interimResults = false;
const sampleRateHertz = 16000;
const speechContexts = [
  {
    phrases: [
      'mail',
      'email'
    ],
    boost: 20.0
  }
]

// console.log(example);
// console.log(projectId);

// load all the libraries for the server
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const http = require('http');
const cors = require('cors');
const express = require('express');
const ss = require('socket.io-stream');
// load all the libraries for the Dialogflow part
const uuid = require('uuid');
const util = require('util');
const { Transform, pipeline } = require('stream');
const pump = util.promisify(pipeline);
const df = require('dialogflow').v2beta1;

// set some server variables
const app = express();
var server;
var sessionId, sessionClient, sessionPath, request;
var speechClient, requestSTT, ttsClient, requestTTS, mediaTranslationClient, requestMedia;

// STT demo
const speech = require('@google-cloud/speech');

// TTS demo
const textToSpeech = require('@google-cloud/text-to-speech');

// Media Translation Demo
const mediatranslation = require('@google-cloud/media-translation');

/**
 * Setup Express Server with CORS and SocketIO
 */
function setupServer(){
    // setup Express
    // Static files
    app.use(express.static(__dirname + '/public'));
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/views/main.html'));
    });
    app.get("/STTtranscribe",function(req,res){
      res.sendFile(path.join(__dirname + '/views/STTtranscribe.html'));
    });
    server = http.createServer(app);
    io = socketIo(server);
    server.listen(4000, function(){
        console.log('listening for requests on port 4000');
    });

     // Listener, once the client connect to the server socket
    io.on('connect', (client) => {
        console.log(`Client connected [id=${client.id}]`);
    });
}

setupServer();
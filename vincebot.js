var Discordie = require("discordie");
var client = new Discordie();

"use strict";

var lame = require('lame');
var fs = require('fs');

var Discordie;
try { Discordie = require("../"); } catch(e) {}
try { Discordie = require("discordie"); } catch(e) {}

var client = new Discordie({autoReconnect: true});

var auth = { token: "MjcyMDE4MjY5ODQ4ODYyNzIx.C2O4XA.cIi1O7qHM4WEfwk5uYAk8Tg_6q0" };

client.connect(auth);

client.Dispatcher.on("GATEWAY_READY", e => {
  const guild = client.Guilds.getBy("name", "Columbanigga");
  if (!guild) return console.log("Guild not found");

  const general = guild.voiceChannels.find(c => c.name == "/r/nofunallowed");
  if (!general) return console.log("Channel not found");

  return general.join(false, false);
});

// After a message is sent in chat
client.Dispatcher.on("MESSAGE_CREATE", (e) => {
  const content = e.message.content;
  const channel = e.message.channel;
  const guild = e.message.channel.guild;

  switch (content) {
    case "!vhelp":
      return e.message.reply("I REFUSE TO SIGN THE LEGISLATION THAT ALLOWS A HELP COMMAND");
    
    case "!cum":
      var info = client.VoiceConnections.getforGuild(guild);
      var file = fs.createReadStream("cum.mp3");
      
    //Leave the voice channel we're in
    case "!leave":
      leave();
    break;
    
    case "!shykel":
      return e.message.reply("FUCK Shykel.");

    case "!enough":
    var info = client.VoiceConnections.getForGuild(guild);
    var file = fs.createReadStream("theresonlyenough.mp3");
    if (info) play(info, file);
    break;
    
    case "!sneezy":
    var info = client.VoiceConnections.getForGuild(guild);
    var file = fs.createReadStream("itsTheBrandNew.mp3");
    if (info) play(info, file);
    break;
  }

// Join a specified voice channel
  if (content.indexOf("!join ") == 0) {
    const targetChannel = content.replace("!join ", "");

    var vchannel =
      guild.voiceChannels
      .find(channel => channel.name.toLowerCase().indexOf(targetChannel) >= 0);
    if (vchannel) vchannel.join().then(info => playIntro(info));
  }
  
  if (content.indexOf("!say ") == 0 ){
    return e.message.reply(content.indexOf(content) >= 0);
  }

  if (content.indexOf("!play") == 0) {
    if (!client.VoiceConnections.length) {
      return e.message.reply("Not Michaeled down to any channel");
    }
    var info = client.VoiceConnections.getForGuild(guild);
    if (info) playIntro(info);
  }

  if (content.indexOf("!stop") == 0) {
    var info = client.VoiceConnections.getForGuild(guild);
    if (info) {
      var encoderStream = info.voiceConnection.getEncoderStream();
      encoderStream.unpipeAll();
    }
  }
});

client.Dispatcher.on("VOICE_USER_SELF_MUTE", (e) => {

  const guild = client.Guilds.getBy("id", "153308682350886912");
  
  if (!guild)
  {
    const channel = client.VoiceConnections.getForGuild(guild);

    if (!channel) return console.log("Channel has been deleted");

    //var decoder = e.voiceConnection.getDecoder();


    const user = channel.voiceConnection.ssrcToMember(channel.content.user);
    var info = client.VoiceConnections.getForGuild(guild);
    
    var file = fs.createReadStream("itsTheBrandNew.mp3");
    if (info) play(info, file);
  }

});


client.Dispatcher.on("VOICE_CONNECTED", e => {
  // uncomment to play on join
  playIntro();
});

function leave()
{
  client.Channels
  .filter(channel => channel.isGuildVoice && channel.joined)
  .forEach(channel => channel.leave());
}

function play(info, file) {
  if (!client.VoiceConnections.length) {
    return console.log("Voice not connected");
  }

  if (!info) info = client.VoiceConnections[0];

  var mp3decoder = new lame.Decoder();
  //file = fs.createReadStream("theresonlyenough.mp3");
  file.pipe(mp3decoder);

  mp3decoder.on('format', pcmfmt => {
    // note: discordie encoder does resampling if rate != 48000
    var options = {
      frameDuration: 60,
      sampleRate: pcmfmt.sampleRate,
      channels: pcmfmt.channels,
      float: false
    };

    var encoderStream = info.voiceConnection.getEncoderStream(options);
    if (!encoderStream) {
      return console.log(
        "Unable to get encoder stream, connection is disposed"
      );
    }

    // Stream instance is persistent until voice connection is disposed;
    // you can register timestamp listener once when connection is initialized
    // or access timestamp with `encoderStream.timestamp`
    encoderStream.resetTimestamp();
    encoderStream.removeAllListeners("timestamp");
    encoderStream.on("timestamp", time => console.log("Time " + time));

    // only 1 stream at a time can be piped into AudioEncoderStream
    // previous stream will automatically unpipe
    mp3decoder.pipe(encoderStream);
  //  mp3decoder.once('end');

    // must be registered after `pipe()`
    encoderStream.once("unpipe", () => file.destroy());
  });
}

function playIntro(info) {
  if (!client.VoiceConnections.length) {
    return console.log("Voice not connected");
  }

  if (!info) info = client.VoiceConnections[0];

  var mp3decoder = new lame.Decoder();
  var file = fs.createReadStream("jan.mp3");
  file.pipe(mp3decoder);

  mp3decoder.on('format', pcmfmt => {
    // note: discordie encoder does resampling if rate != 48000
    var options = {
      frameDuration: 60,
      sampleRate: pcmfmt.sampleRate,
      channels: pcmfmt.channels,
      float: false
    };

    var encoderStream = info.voiceConnection.getEncoderStream(options);
    if (!encoderStream) {
      return console.log(
        "Unable to get encoder stream, connection is disposed"
      );
    }

    // Stream instance is persistent until voice connection is disposed;
    // you can register timestamp listener once when connection is initialized
    // or access timestamp with `encoderStream.timestamp`
    encoderStream.resetTimestamp();
    encoderStream.removeAllListeners("timestamp");
    encoderStream.on("timestamp", time => console.log("Time " + time));

    // only 1 stream at a time can be piped into AudioEncoderStream
    // previous stream will automatically unpipe
    mp3decoder.pipe(encoderStream);
    //mp3decoder.once('end');

    // must be registered after `pipe()`
    encoderStream.once("unpipe", () => file.destroy());
  });
}

client.Dispatcher.onAny((type, e) => {
  var ignore = [
    "READY",
    "GATEWAY_READY",
    "ANY_GATEWAY_READY",
    "GATEWAY_DISPATCH",
    "PRESENCE_UPDATE",
    "TYPING_START",
  ];
  if (ignore.find(t => (t == type || t == e.type))) {
    return console.log("<" + type + ">");
  }

  console.log("\nevent " + type);
  return console.log("args " + JSON.stringify(e));
});

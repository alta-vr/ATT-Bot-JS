"use strict";
// import WebsocketBot, { Server } from './WebsocketBot';
// import { Connection, BasicWrapper, EventType } from 'att-websockets';
// import Discord, { TextChannel } from 'discord.js';
// main();
// async function main()
// {
//     var client = new Discord.Client();
//     var targetChannel:TextChannel|undefined;
//     await new Promise(resolve =>
//     {
//         client.on('ready', resolve);
//         client.login("XXX");
//     });
//     client.on('message', message => {
//         if (targetChannel === undefined && message.content === 'init') 
//         {
//             targetChannel = message.channel as TextChannel;
//             message.channel.send("Initialized!");
//         }
//       });
//     var bot:WebsocketBot = new WebsocketBot();
//     await bot.loginWithHash("XXX", "XXX");
//     await bot.run(test => test.name == "A Pre-Alpha Tale (US)", async (server:Server, connection:Connection) =>
//     {
//         var wrapper = new BasicWrapper(connection);
//         await wrapper.subscribe(EventType.PlayerMovedChunk, data =>
//         { 
//             if (targetChannel != undefined)
//             {
//                 targetChannel.send(data.player.username + " moved to " + data.newChunk);
//             }
//         });
//     });
// }

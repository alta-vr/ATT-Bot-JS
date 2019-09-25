"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebsocketBot_1 = __importDefault(require("./WebsocketBot"));
const att_websockets_1 = require("att-websockets");
const discord_js_1 = __importDefault(require("discord.js"));
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var client = new discord_js_1.default.Client();
        var targetChannel;
        yield new Promise(resolve => {
            client.on('ready', resolve);
            client.login("XXX");
        });
        client.on('message', message => {
            if (targetChannel === undefined && message.content === 'init') {
                targetChannel = message.channel;
                message.channel.send("Initialized!");
            }
        });
        var bot = new WebsocketBot_1.default();
        yield bot.loginWithHash("XXX", "XXX");
        yield bot.run(test => test.name == "A Pre-Alpha Tale (US)", (server, connection) => __awaiter(this, void 0, void 0, function* () {
            var wrapper = new att_websockets_1.BasicWrapper(connection);
            yield wrapper.subscribe(att_websockets_1.EventType.PlayerMovedChunk, data => {
                if (targetChannel != undefined) {
                    targetChannel.send(data.player.username + " moved to " + data.newChunk);
                }
            });
        }));
    });
}

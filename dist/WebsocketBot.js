"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const att_websockets_1 = require("att-websockets");
const alta_jsapi_1 = require("alta-jsapi");
const sha512_1 = __importDefault(require("crypto-js/sha512"));
const chalk_1 = __importDefault(require("chalk"));
const defaultOptions = {
    refreshOnlineInterval: 60000,
    connectDelayInterval: 15000
};
class WebsocketBot {
    constructor() {
        this.options = defaultOptions;
    }
    configure(options) {
        this.options = Object.assign(Object.assign({}, defaultOptions), options);
    }
    loginWithHash(username, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            yield alta_jsapi_1.Sessions.loginWithUsername(username, hash);
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let hash = sha512_1.default(password).toString();
            yield this.loginWithHash(username, hash);
        });
    }
    run(condition, handleConnection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(chalk_1.default.green("Username: " + alta_jsapi_1.Sessions.getUsername()));
            var online = [];
            while (true) {
                var running = yield alta_jsapi_1.Servers.getRunning();
                running = running.filter(condition);
                for (var server of running) {
                    if (online.findIndex(item => item.id == server.id) < 0) {
                        online.push(server);
                        yield new Promise(resolve => {
                            console.log(chalk_1.default.blue("Server " + server.name + " is online, connecting in " + (this.options.connectDelayInterval / 1000) + "s"));
                            setTimeout(beginConnection, this.options.connectDelayInterval, server);
                            resolve();
                        });
                    }
                }
                yield new Promise(resolve => setTimeout(resolve, this.options.refreshOnlineInterval));
            }
            function beginConnection(server) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        var details = yield alta_jsapi_1.Servers.joinConsole(server.id);
                        if (details.allowed) {
                            console.log(chalk_1.default.blue("Connecting to " + server.name + "!"));
                            let remoteConsole = new att_websockets_1.Connection(server.name);
                            remoteConsole.onError = handleError;
                            remoteConsole.onMessage = handleMessage;
                            remoteConsole.onClose = handleDisconnect;
                            yield remoteConsole.connect(details.connection.address, details.connection.websocket_port, details.token);
                            handleConnection(server, remoteConsole);
                        }
                        else {
                            console.log(chalk_1.default.blue("Ignoring " + server.name + " - Not allowed!"));
                        }
                    }
                    catch (error) {
                        console.error(chalk_1.default.red("Error running on " + server.name));
                        console.error(error);
                    }
                    function handleMessage(message) {
                        var { data } = message;
                        console.log(data);
                    }
                    function handleError(error) {
                        console.error(chalk_1.default.red("Error from connection!"));
                        console.error(error);
                    }
                    function handleDisconnect() {
                        console.error(chalk_1.default.red("Disconnected from " + server.name + "!"));
                        var index = online.indexOf(server);
                        online.splice(index, 1);
                    }
                });
            }
        });
    }
}
exports.default = WebsocketBot;

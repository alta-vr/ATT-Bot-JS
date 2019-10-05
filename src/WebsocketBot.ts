import { Connection, Message, MessageType } from 'att-websockets';
import { Sessions, Servers } from 'alta-jsapi';
import sha512 from 'crypto-js/sha512';

import chalk from 'chalk';

export type Server =
{
    name:string,
    id:number
}

export type Options =
{
    refreshOnlineInterval:number,
    connectDelayInterval:number
}

const defaultOptions:Options = {
    refreshOnlineInterval: 60000,
    connectDelayInterval: 15000
}

export default class WebsocketBot
{
    options:Options = defaultOptions;

    configure(options:Options)
    {
        this.options = {
            ...defaultOptions,
            ...options
        };
    }

    async loginWithHash(username:string, hash:string)
    {
        await Sessions.loginWithUsername(username, hash);
    }

    async login(username:string, password:string)
    {
        let hash = sha512(password).toString();

        await this.loginWithHash(username, hash);
    }

    async run(condition:(item:Server)=>boolean, handleConnection:(server:Server, connection:Connection)=>void)
    {
        console.log(chalk.green("Username: " + Sessions.getUsername()));

        var online:Server[] = [];
        
        while (true)
        {
            var running = await Servers.getRunning();

            running = running.filter(condition);

            for (var server of running)
            {
                if (online.findIndex(item => item.id == server.id) < 0)
                {
                    online.push(server);

                    await new Promise<void>(resolve => setTimeout( beginConnection, this.options.connectDelayInterval, server ));
                }
            }

            await new Promise<void>(resolve => setTimeout(resolve, this.options.refreshOnlineInterval));
        }

        async function beginConnection(server:any)
        {
            try
            {
                var details = await Servers.joinConsole(server.id);
        
                if (details.allowed)
                {
                    console.log(chalk.blue("Connecting to " + server.name + "!"));

                    let remoteConsole = new Connection(server.name);
            
                    remoteConsole.onError = handleError;
                    remoteConsole.onMessage = handleMessage;
                    remoteConsole.onClose = handleDisconnect;
            
                    await remoteConsole.connect(details.connection.address, details.connection.websocket_port, details.token);
            
                    handleConnection(server, remoteConsole);
                }
                else
                {
                    console.log(chalk.blue("Ignoring " + server.name + " - Not allowed!"));
                }
            }
            catch (error)
            {
                console.error(chalk.red("Error running on " + server.name));
                console.error(error);
            }
        
            function handleMessage(message:Message)
            {
                var { data } = message;
        
                console.log(data);
            }
        
            function handleError(error:any)
            {
                console.error(chalk.red("Error from connection!"));
                console.error(error);
            }

            function handleDisconnect()
            {
                console.error(chalk.red("Disconnected from " + server.name + "!"));

                var index = online.indexOf(server);
                online.splice(index, 1);
            }
        }
    }
}

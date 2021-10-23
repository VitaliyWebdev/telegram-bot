
const token = "2071177656:AAGwJBHEJdneAbmz3k_9XH4JiYBYqtReunI";
const TelegramApi = require("node-telegram-bot-api");
const gameOptions = require("./game-options");

const bot = new TelegramApi(token, { polling: true });

const chats = {};


const startGame = async (chatId) => {
    // console.log("==============")
    await bot.sendMessage(chatId, 'Я загадую - ти відгадуєш число від 0 до 9');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    return bot.sendMessage(chatId, 'Ну відгадуй...', gameOptions.gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'почати юзати бота' },
        { command: '/info', description: 'Получити інфу' },
        { command: '/game', description: "Відгадай цифру" }
    ])

    bot.on('message', async msg => {
        const { text, chat: { id }, from: { first_name } } = msg;

        switch (text) {
            case '/start': {
                await bot.sendSticker(id, "https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/4.webp")
                return bot.sendMessage(id, `${first_name} Дарова Ебать`);
            }
            case '/info': {
                return bot.sendMessage(id, `${first_name} ТВІЙ ПІСЮН = 2cm`)
            }
            case '/game': {
                return startGame(id)
            }
            default: {
                await bot.sendMessage(id, `${first_name} шо ти ліпиш! ніхуя не понятно!!!`)
                return bot.sendSticker(id, "https://tlgrm.ru/_/stickers/7a7/58d/7a758d16-1a19-326c-9b83-394a774b5e78/2.webp")
            }
        }


    })

    bot.on('callback_query', async msg => {
        const { data, message: { chat: { id } } } = msg;
        if (data === '/repeat') return startGame(id);
        if (data === chats[id]?.toString()) {
            return bot.sendMessage(id, `Ти вгадав цифру! ${chats[id]}`, gameOptions.repeatGameOptions)
        } else {
            return bot.sendMessage(id, `Ти не вгадав цифру!,бот загадав ${chats[id]}`, gameOptions.repeatGameOptions)
        }


    })
}

start()
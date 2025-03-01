const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');

const client = new Client();

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
client.on('ready', async () => {
    console.log('Client is ready!');
    // scheduleReminderTester()
    scheduleReminder();
    scheduleReminder2();
    scheduleReminder3();
});
// Listening to all incoming messages
client.on('message_create', async message => {
	console.log(message.body);
    if (message.body === '!ping') {
		client.sendMessage(message.from, 'pong');
	}
    else if (message.body === '!remind') {
        const timeLeft = getTimeUntilNextReminder();
        client.sendMessage(message.from, `${timeLeft}`);
    }
    else if (message.body.toLowerCase() === '!check') {
        console.log("Command !check received.");

        const chats = await client.getChats();
        console.log(`Total chats retrieved: ${chats.length}`);

        // Coba cara lain untuk mendapatkan grup
        const groups = chats.filter(chat => chat.id.server === 'g.us');
        console.log(`Total groups found: ${groups.length}`);

        if (groups.length === 0) {
            await message.reply("Bot tidak tergabung dalam grup mana pun.");
            return;
        }

        let groupList = "*Daftar Grup yang Tersedia:*\n";
        groups.forEach((group, index) => {
            groupList += `${index + 1}. ${group.name} (ID: ${group.id._serialized})\n`;
        });

        await message.reply(groupList);
    }
});

// async function scheduleReminderTester() {
//     schedule.scheduleJob('*/1 * * * *', async () => { 
//         const reminderMessage = "Selamat Pagi! Jangan lupa untuk foto (sahur).";
//         const groupId = "120363389495570396@g.us"; 

//         try {
//             await client.sendMessage(groupId, reminderMessage);
//             console.log(`Reminder sent to group ID: ${groupId}`);
//         } catch (error) {
//             console.error("Gagal mengirim reminder:", error);
//         }
//     });
// }

async function scheduleReminder() {
    schedule.scheduleJob('0 5 * * *', async () => { 
        const reminderMessage = "Selamat Pagi! Jangan lupa untuk foto (sahur).";
        const groupId = "120363389495570396@g.us"; 

        try {
            await client.sendMessage(groupId, reminderMessage);
            console.log(`Reminder sent to group ID: ${groupId} at 05:00 AM`);
        } catch (error) {
            console.error("Gagal mengirim reminder:", error);
        }
    });
}

async function scheduleReminder2() {
    schedule.scheduleJob('0 12 * * *', async () => { 
        const reminderMessage = "Selamat Siang! Jangan lupa untuk foto (jam 12).";
        const groupId = "120363389495570396@g.us"; 

        try {
            await client.sendMessage(groupId, reminderMessage);
            console.log(`Reminder sent to group ID: ${groupId} at 12:00 PM`);
        } catch (error) {
            console.error("Gagal mengirim reminder:", error);
        }
    });
}

async function scheduleReminder3() {
    schedule.scheduleJob('0 17 * * *', async () => { 
        const reminderMessage = "Selamat Sore! Jangan lupa untuk foto (jam 5 sore).";
        const groupId = "120363389495570396@g.us"; 

        try {
            await client.sendMessage(groupId, reminderMessage);
            console.log(`Reminder sent to group ID: ${groupId} at 5:00 PM`);
        } catch (error) {
            console.error("Gagal mengirim reminder:", error);
        }
    });
}
function getTimeUntilNextReminder() {
    const now = new Date();
    const reminders = [
        { time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 0, 0), label: "05:00 pagi" },
        { time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0), label: "12:00 siang" },
        { time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0), label: "17:00 sore" }
    ];

    let result = reminders.map(({ time, label }) => {
        if (now > time) {
            time.setDate(time.getDate() + 1); 
        }

        const diff = time - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `⏳ Reminder ${label} dalam ${hours} jam, ${minutes} menit.`;
    });

    return result.join("\n");
}
client.initialize();

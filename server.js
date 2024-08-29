const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const logFilePath = path.join(__dirname, 'visitorLogs.json');

// Middleware: Gelen her istekte log kaydı tutar
app.use((req, res, next) => {
    const visitorLog = {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
    };

    // JSON dosyasını güncelle
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            logs = JSON.parse(data);
        }

        logs.push(visitorLog);

        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
            if (err) {
                console.error('Log kaydedilemedi:', err);
            }
        });
    });

    next();
});

// Basit bir ana sayfa
app.get('/', (req, res) => {
    res.send('Hoş geldiniz! Ziyaretçi logları kaydediliyor.');
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});

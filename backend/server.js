require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const os      = require('os');
const rutas   = require('./src/routes/api.routes');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Sirve el frontend (carpeta raíz del proyecto, un nivel arriba del backend)
app.use(express.static(path.join(__dirname, '..')));

// Devuelve la IP local de red para construir URLs accesibles desde otros dispositivos
app.get('/api/server-url', (req, res) => {
    const interfaces = os.networkInterfaces();
    let ip = 'localhost';
    for (const iface of Object.values(interfaces)) {
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                ip = alias.address;
                break;
            }
        }
    }
    res.json({ url: `http://${ip}:${PORT}` });
});

app.use('/api', rutas);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

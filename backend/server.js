require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const rutas   = require('./src/routes/api.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: 'API SafeTag QR funcionando', version: '1.0.0' });
});

app.use('/api', rutas);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const express = require('express');
const router  = express.Router();
const { obtenerPerfilPublico, registrar, login, misPulseras, agregarPulsera } = require('../controllers/perfiles.controller');

router.get('/publico/:token', obtenerPerfilPublico);
router.post('/registro', registrar);
router.post('/login', login);
router.get('/mis-pulseras', misPulseras);
router.post('/pulseras', agregarPulsera);

module.exports = router;

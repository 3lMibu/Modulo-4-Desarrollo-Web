const express = require('express');
const router  = express.Router();
const { obtenerPerfilPublico, registrar } = require('../controllers/perfiles.controller');

router.get('/publico/:token', obtenerPerfilPublico);
router.post('/registro', registrar);

module.exports = router;

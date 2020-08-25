const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

//Routes

router.get('/', routesController.index_GET);
router.get('/crear_mandril', routesController.crear_mandril_GET);
router.post('/guardar_mandril', routesController.guardar_mandril_POST);
router.get('/status_mandriles', routesController.status_mandriles_GET);
router.post('/historial_mandril', routesController.historial_mandril_POST);
router.post('/liberar/:id', routesController.liberar_POST);
router.post('/guardar_liberar', routesController.guardar_liberar_POST);
router.get('/mandriles', routesController.mandriles_GET)
router.post('/guardar_rechazar', routesController.guardar_rechazar_POST);
router.get('/notificar', routesController.notificar_GET);
router.post('/guardar_notificar', routesController.guardar_notificar_POST);
router.post('/eliminar_notificar', routesController.eliminar_notificar_POST);
router.post('/guardar_espera', routesController.guardar_espera_POST);
router.post('/plano', routesController.plano_POST);
router.post('/reemplazar_plano', routesController.reemplazar_plano_POST);
router.post('/mandril_info', routesController.mandril_info_POST);
router.post('/historial_info', routesController.historial_info_POST);
router.get('/consulta_mandril/:id', routesController.consulta_mandril_GET);
router.post('/obsoleto', routesController.obsoleto_POST);


router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;
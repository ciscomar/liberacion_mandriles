//Conexion a base de datos
const db = require('../public/db/conn');
const controller = {};

//Require Funciones
const funcion = require('../public/js/controllerFunctions');
const funcionE = require('../public/js/empleadosFunctions');
var fileupload = require("express-fileupload");

// Index GET
controller.index_GET = (req, res) => {
    let user = req.connection.user
    res.render('index.ejs', {
        user: user
    });

};


controller.crear_mandril_GET = (req, res) => {
    access = false;
    let user = req.connection.user

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Tooling') {
            access = true;
            break;
        }
    }
    if (access == true) {
        funcion.controllerPlataformas((err, result2) => {
            if (err) throw err;

            funcion.controllerAllMandriles((err, result3) => {
                if (err) throw err;

                res.render('crear_mandril.ejs', {
                    data1: result2, user: user, data2: result3
                });
            });
        });
    } else {

        res.render('acceso_denegado.ejs', {
            user: user
        });
    }

};

controller.notificar_GET = (req, res) => {
    access = false;
    let user = req.connection.user

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Admin' ) {
            access = true;
            break;
        }
    }
    if (access == true) {
        funcionE.empleadosTodos((err, result) => {
            if (err) throw err;
            funcion.controllerNotificar((err, result2) => {
                if (err) throw err;

                res.render('notificar.ejs', {
                    user: user, data: result, data2: result2
                });
            });
        });
    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }

};



controller.guardar_mandril_POST = (req, res) => {
    let user = req.connection.user
    id = req.body.id
    parte = req.body.parte
    cliente = req.body.cliente
    plataforma = req.body.plataforma
    username = user.substring(4)
    status = 'Actividad Liberada'
    prioridad = req.body.prioridad
    total = req.body.total
    motivo = req.body.motivo
    tipo = req.body.tipo
    revision = req.body.revision
    POpenDiametroMinimo = req.body.OpenDiametroMinimo
    POpenDiametroMaximo = req.body.OpenDiametroMaximo
    POpenEspesorMinimo = req.body.OpenEspesorMinimo
    POpenEspesorMaximo = req.body.OpenEspesorMaximo
    PInterDiametroMinimo = req.body.InterDiametroMinimo
    PInterDiametroMaximo = req.body.InterDiametroMaximo
    PBossDiametroMinimo = req.body.BossDiametroMinimo
    PBossDiamentroMaximo = req.body.BossDiametroMaximo
    PBossEspesorMinimo = req.body.BossEspesorMinimo
    PBossEspesorMaximo = req.body.BossEspesorMaximo
    //Pinputfile = req.body.fileUploader
    consecutivo = req.body.consecutivo
    let newconsecutivo
    let lastconsecutivo
    planoRep= req.body.planoRep

   
    

    funcion.controllerLastPlano(id, (err, numplano) => {
        if (err) throw err;
        
        numplano++;
       if(planoRep == "NUEVO"){
      
        let fileUploader = req.files.fileUploader;
            fileUploader.mv('D:/DEL/liberacion_mandriles/' + 'P' + id + '-' + numplano + '.pdf', function (err) {
            //fileUploader.mv('C:/test/' + 'P' + id + '-' + numplano + '.pdf', function (err) {
                if (err)
                    return res.status(500).send(err);
            });
             
        }else{
            numplano=planoRep
        }

        
        
        newconsecutivo = consecutivo
        // funcion.controllerLastConsecutivo(id, (err, consecutivo) => {
        //     if (err) throw err;
        //     newconsecutivo = consecutivo + 1
        //     consecutivo++;



        

        for (let i = 0; i < total; i++) {

            funcion.controllerInsertMandril(id, consecutivo, parte, plataforma, cliente, motivo, tipo, prioridad, numplano, revision, (err, result2) => {
                if (err) throw err;
            });

            funcion.controllerInsertInfoPlano(id, consecutivo,
                POpenDiametroMinimo,
                POpenDiametroMaximo,
                POpenEspesorMinimo,
                POpenEspesorMaximo,
                PInterDiametroMinimo,
                PInterDiametroMaximo,
                PBossDiametroMinimo,
                PBossDiamentroMaximo,
                PBossEspesorMinimo,
                PBossEspesorMaximo,
                numplano, (err, result2) => {
                    if (err) throw err;
                });

            funcion.controllerInsertReporte(id, consecutivo, (err, result2) => {
                if (err) throw err;
            });

            funcion.controllerInsertMandrilHistorial(id, consecutivo, username, 1, '', status, (err, result2) => {
                if (err) throw err;
            });

            consecutivo++


        }
        //lastconsecutivo = consecutivo - 1
        lastconsecutivo = consecutivo - 1

        res.render('guardar_mandril.ejs', {
            data: { id, parte, plataforma, prioridad, total, newconsecutivo, lastconsecutivo }, user: username
        });

        //});
    });
};

controller.status_mandriles_GET = (req, res) => {
    access = false;
    area = 0;
    areastring = '';
    let user = req.connection.user


    for (let i = 0; i < req.connection.userGroups.length; i++) {

        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Lanzamientos' ) {
            access = true;
            area = 1;
            areastring = 'Lanzamientos'
            break;
        } else
            if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Tooling'  ) {
                access = true;
                area = 2;
                areastring = 'Tooling'
                break;
            } else
                if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Procesos') {
                    access = true;
                    area = 3;
                    areastring = 'Procesos'
                    break;
                } else
                    if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Procesos_Extrusion' ) {
                        access = true;
                        area = 4;
                        areastring = 'Procesos Extrusion'
                        break;
                    } else
                        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Calidad') {
                            access = true;
                            area = 5;
                            areastring = 'Calidad'
                            break;
                        } else
                            if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Calidad_Ensamble') {

                                access = true;
                                area = 6;
                                areastring = 'Calidad Ensamble'
                                break;
                            } else
                                if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Produccion') {
                                    access = true;
                                    area = 7;
                                    areastring = 'Produccion'

                                }
    }


    if (access == true) {

        if (area == 1) {
            funcion.controllerTablaStatusLanzamientos((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 2) {
            funcion.controllerTablaStatusTooling((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 3) {
            funcion.controllerTablaStatusProcesos((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 4) {
            funcion.controllerTablaStatusProcesos_Extrusion((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 5) {
            funcion.controllerTablaStatusCalidad((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 6) {
            funcion.controllerTablaStatusCalidad_Ensamble((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        }



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }

};


controller.historial_mandril_POST = (req, res) => {
    let user = req.connection.user
    id = req.body.idmandril;
    mandril_id = id.substring(0, id.indexOf("-"));
    mandril_consec = id.substring(id.lastIndexOf("-") + 1)

    funcion.controllerHistorial(mandril_id, mandril_consec, (err, result) => {
        if (err) throw err;

        res.render('historial_mandril.ejs', {
            user: user, data: result
        });
    })

};

controller.liberar_POST = (req, res) => {
    accion = req.params.id;
    let user = req.connection.user
    id = req.body.idmandrill;
    consecutivo = req.body.consecutivo
    actividad = req.body.actividad;
    username = user.substring(4)
    descripcion = req.body.descripcion;
    numeroplano = req.body.numeroplano

    funcion.selectAllLiberar(id, actividad,numeroplano,  (err, result) => {
        if (err) throw err;

    res.render('liberar.ejs', {
        user: username, data: { id, actividad, consecutivo, descripcion, numeroplano }, accion: accion, data2:result
    });
});


};

controller.guardar_liberar_POST = (req, res) => {

    let user = req.connection.user
    username = user.substring(4)
    id = req.body.id;
    mandril_id = id.substring(0, id.indexOf("-"));
    mandril_consec = id.substring(id.lastIndexOf("-") + 1)
    actividad = req.body.actividad;
    comentario = req.body.comentario;
    status2 = 'Actividad Liberada'
    actividadNumber = parseInt(actividad)
    nextActividad = actividadNumber + 1
    color2 = 'success'
    numeroplano = req.body.numeroplano

    familia = req.body.familia;
    lgreen = req.body.lgreen;
    lvulca = req.body.lvulca;

    IDE = req.body.IDE
    ODE = req.body.ODE
    BDE = req.body.BDE
    ODI = req.body.ODI
    BDI = req.body.BDI
    OEsp = req.body.OEsp
    BEsp = req.body.BEsp

    CODI = req.body.CODI
    CBDI = req.body.CBDI
    COEsp = req.body.COEsp
    CBEsp = req.body.CBEsp
    COG = req.body.COG
    CBG = req.body.CBG

    fix_muescas = req.body.fix_muescas
    fix_tejido = req.body.fix_tejido
    fix_longitud = req.body.fix_longitud
    fix_ruta = req.body.fix_ruta
    fix_tapa = req.body.fix_tapa
    fix_ensamblaje = req.body.fix_ensamblaje
    fix_goma = req.body.fix_goma
    fix_verificar = req.body.fix_verificar




    if (familia != undefined) {

        funcion.selectAllLiberar(mandril_id, actividad, numeroplano, (err, allMandriles) => {
            if (err) throw err;


            for (let i = 0; i < allMandriles.length; i++) {

                funcion.controllerUpdateInfo(mandril_id, allMandriles[i].mandril_consec, familia, "fam", (err, resu) => {
                    if (err) throw err;
                });

            }
        });
    }
    if (lgreen != undefined) {

        funcion.selectAllLiberar(mandril_id, actividad, numeroplano, (err, allMandriles) => {
            if (err) throw err;
            for (let i = 0; i < allMandriles.length; i++) {
                funcion.controllerUpdateInfo(mandril_id, allMandriles[i].mandril_consec, lgreen, "lgreen", (err, resu) => {
                    if (err) throw err;
                });

            }
        });
    }
    if (lvulca != undefined) {

        funcion.controllerUpdateInfo(mandril_id, mandril_consec, lvulca, "lvulca", (err, resu) => {
            if (err) throw err;
        });

        funcion.controllerUpdateReporte(mandril_id, mandril_consec, IDE, ODE, BDE, ODI, BDI, OEsp, BEsp, (err, resu) => {
            if (err) throw err;
        });
    }
    if (CODI != undefined) {

        funcion.controllerUpdateReporteCalidad(mandril_id, mandril_consec, CODI, CBDI, COEsp, CBEsp, COG, CBG, (err, resu) => {
            if (err) throw err;
        });
    }
    if (fix_muescas != undefined) {

        funcion.controllerUpdateReporteCalidadEnsamble(mandril_id, mandril_consec, fix_muescas, fix_tejido, fix_longitud, fix_ruta, fix_tapa, fix_ensamblaje, fix_goma, fix_verificar, (err, resu) => {
            if (err) throw err;
        });
    }
    // if (espesor != undefined) {

    //     funcion.controllerUpdateInfo(mandril_id, mandril_consec, espesor, "espesor", (err, resu) => {
    //         if (err) throw err;
    //     });
    // }
    // if (diametro != undefined) {

    //     funcion.controllerUpdateInfo(mandril_id, mandril_consec, diametro, "diametro", (err, resu) => {
    //         if (err) throw err;
    //     });
    // }
    // if (groove != undefined) {

    //     funcion.controllerUpdateInfo(mandril_id, mandril_consec, groove, "groove", (err, resu) => {
    //         if (err) throw err;
    //     });
    // }
    let fileExist = req.files

    if (fileExist != null) {
        let fileUploader = req.files.fileUploader;
        fileUploader.mv('D:/DEL/liberacion_mandriles/' + 'F' + id + '.pdf', function (err) {
            if (err)
                return res.status(500).send(err);

        });

    }

    if (actividad == 10) {
        estadom = 'Liberado'
    } else {
        estadom = 'Proceso'
    }


    //<!--08/04/2020-->liberar todos mandriles iguales en lanzamientos en misma actividad
    if (actividad == 3  || actividad == 9  || actividad == 2) {

        funcion.selectAllLiberar(mandril_id, actividad, numeroplano, (err, allMandriles) => {
            if (err) throw err;

            for (let i = 0; i < allMandriles.length; i++) {

                funcion.controllerInsertMandrilHistorial(mandril_id, allMandriles[i].mandril_consec, username, actividad, comentario, status2, (err, result2) => {
                    if (err) throw err;

                    funcion.controllerUpdateMandrilStatus(mandril_id, allMandriles[i].mandril_consec, nextActividad, estadom, (err, result3) => {
                        if (err) throw err;

                    });
                });

            }
        });


    }else if(actividad == 7 || actividad == 4){

        consecutivost = req.body.consecutivosI
        allconsecutivos= consecutivost.split(',')
        //console.log(allconsecutivos)
        for (let i = 0; i < allconsecutivos.length; i++) {

            funcion.controllerInsertMandrilHistorial(mandril_id, allconsecutivos[i], username, actividad, comentario, status2, (err, result2) => {
                if (err) throw err;

                funcion.controllerUpdateMandrilStatus(mandril_id, allconsecutivos[i], nextActividad, estadom, (err, result3) => {
                    if (err) throw err;

                });
            });

        }



    } else {

        funcion.controllerInsertMandrilHistorial(mandril_id, mandril_consec, username, actividad, comentario, status2, (err, result2) => {
            if (err) throw err;

            funcion.controllerUpdateMandrilStatus(mandril_id, mandril_consec, nextActividad, estadom, (err, result3) => {
                if (err) throw err;

            });
        });

    }
    //<!--08/04/2020-->

    res.render('guardar_liberar.ejs', {
        user: username, data: { id, comentario, status2, color2 }
    });


    /////////////////////////////////////////////////////////////////////////////
    funcion.controllerAreaActividad(nextActividad, (err, dep) => {
        if (err) throw err;
        funcion.controllerInfoMandril(mandril_id, mandril_consec, (err, mandril) => {
            if (err) throw err;
            funcion.controllerActividad(actividad, (err, actividadAnt) => {
                if (err) throw err;

                if (actividad == 9) {
                    funcion.controllerCorreosAll((err, correo) => {
                        for (var i = 0; i < correo.length; i++) {


                            to = correo[i].correo;
                            cc = '';
                            subject = 'Liberación de Mandriles: #' + id + ' Parte: ' + mandril.mandril_numparte + ' Plataforma: ' + mandril.mandril_plat + ' Familia: ' + mandril.mandril_fam
                            status = 'Mandril Liberado';
                            id = id
                            parte = mandril.mandril_numparte
                            plataforma = mandril.mandril_plat
                            familia = mandril.mandril_fam
                            prioridad = mandril.mandril_prioridad
                            user = username
                            comentario = comentario
                            activSiguiente = dep.activ_descripcion
                            activAnterior = actividadAnt
                            color = '#28a745'
                            colorA = '#28a745'
                            estado = 'Liberada'
                            dataEmail = {
                                to, cc, subject, status, parte, plataforma, familia, prioridad, id, user, comentario, activSiguiente, activAnterior, color, colorA, estado
                            }

                            funcion.sendEmail(dataEmail);
                        }
                    });
                } else {
                    funcion.controllerCorreosArea(dep.activ_area, (err, correo) => {
                        for (var i = 0; i < correo.length; i++) {


                            to = correo[i].correo;
                            cc = '';
                            subject = 'Liberación de Mandriles: #' + id + ' Parte: ' + mandril.mandril_numparte + ' Plataforma: ' + mandril.mandril_plat + ' Familia: ' + mandril.mandril_fam
                            status = 'Liberar Mandril';
                            id = id
                            parte = mandril.mandril_numparte
                            plataforma = mandril.mandril_plat
                            familia = mandril.mandril_fam
                            prioridad = mandril.mandril_prioridad
                            user = username
                            comentario = comentario
                            activSiguiente = dep.activ_descripcion
                            activAnterior = actividadAnt
                            color = '#ffc107'
                            colorA = '#28a745'
                            estado = 'Liberada'
                            dataEmail = {
                                to, cc, subject, status, parte, plataforma, familia, prioridad, id, user, comentario, activSiguiente, activAnterior, color, colorA, estado
                            }

                            funcion.sendEmail(dataEmail);
                        }
                    });
                }
            });

        });
    });

    /////////////////////////////////////////////////////////////////////////////




};

controller.guardar_rechazar_POST = (req, res) => {

    let user = req.connection.user
    username = user.substring(4)
    id = req.body.id;
    mandril_id = id.substring(0, id.indexOf("-"));
    mandril_consec = id.substring(id.lastIndexOf("-") + 1)
    actividad = req.body.actividad;
    comentario = req.body.comentario;
    status2 = 'Rechazado'
    actividadNumber = parseInt(actividad)
    
    color2 = 'danger'
    estado = 'Rechazado'
    numeroplano = req.body.numeroplano
    regresarA = req.body.regresar

    if (regresarA== 'anterior'){
        nextActividad= actividad-1

    }else{

        nextActividad = 2
    }

    if (actividad == 3 || actividad == 2 || actividad == 4) {
       
        funcion.selectAllLiberar(mandril_id, actividad, numeroplano, (err, allMandriles) => {
            if (err) throw err;

            for (let i = 0; i < allMandriles.length; i++) {

                funcion.controllerInsertMandrilHistorial(mandril_id, allMandriles[i].mandril_consec, username, actividad, comentario, status2, (err, result2) => {
                    if (err) throw err;

                    funcion.controllerUpdateMandrilStatus(mandril_id, allMandriles[i].mandril_consec, nextActividad, estado, (err, result3) => {
                        if (err) throw err;
                    });
                });

            }
        });
    }else{

        funcion.controllerInsertMandrilHistorial(mandril_id, mandril_consec, username, actividad, comentario, status2, (err, result2) => {
            if (err) throw err;

            funcion.controllerUpdateMandrilStatus(mandril_id, mandril_consec, nextActividad, estado, (err, result3) => {
                if (err) throw err;
            });
        });


    }


    res.render('guardar_liberar.ejs', {
        user: username, data: { id, comentario, status2, color2 }
    });


    /////////////////////////////////////////////////////////////////////////////
    funcion.controllerAreaActividad(nextActividad, (err, dep) => {
        if (err) throw err;
        funcion.controllerInfoMandril(mandril_id, mandril_consec, (err, mandril) => {
            if (err) throw err;
            funcion.controllerActividad(actividad, (err, actividadAnt) => {
                if (err) throw err;

                funcion.controllerCorreosAll((err, correo) => {
                    for (var i = 0; i < correo.length; i++) {


                        to = correo[i].correo;
                        cc = '';
                        subject = 'Liberación de Mandriles: #' + id + ' Parte: ' + mandril.mandril_numparte + ' Plataforma: ' + mandril.mandril_plat + ' Familia: ' + mandril.mandril_fam
                        status = 'Mandril Rechazado';
                        id = id
                        parte = mandril.mandril_numparte
                        plataforma = mandril.mandril_plat
                        familia = mandril.mandril_fam
                        prioridad = mandril.mandril_prioridad
                        user = username
                        comentario = comentario
                        activSiguiente = ''
                        activAnterior = actividadAnt
                        color = '#dc3545'
                        colorA = '#dc3545'
                        estado = 'Rechazada'

                        dataEmail = {
                            to, cc, subject, status, parte, plataforma, familia, prioridad, id, user, comentario, activSiguiente, activAnterior, color, colorA, estado
                        }

                        funcion.sendEmail(dataEmail);
                    }
                });
            });

        });
    });

    /////////////////////////////////////////////////////////////////////////////
};


controller.mandriles_GET = (req, res) => {
    let user = req.connection.user

    funcion.controllerTablaMandriles((err, result2) => {
        if (err) throw err;
        funcion.controllerCountMandrilesAll('Proceso', "Proceso", (err, result3) => {
            if (err) throw err;
            funcion.controllerCountMandrilesAll('Liberado', "Liberado", (err, result4) => {
                if (err) throw err;
                funcion.controllerCountMandrilesAll('Rechazado', "Rechazado", (err, result5) => {
                    if (err) throw err;
                    funcion.controllerCountMandrilAreaL((err, result6) => {
                        if (err) throw err;
                        funcion.controllerCountMandrilAreaT((err, result7) => {
                            if (err) throw err;
                            funcion.controllerCountMandrilAreaPs((err, result8) => {
                                if (err) throw err;
                                funcion.controllerCountMandrilAreaC((err, result9) => {
                                    if (err) throw err;


                                    mandrilProceso = result3[0].Proceso
                                    mandrilLiberado = result4[0].Liberado
                                    mandrilRechazado = result5[0].Rechazado
                                    mandrilLanzamientos = result6[0].Lanzamientos
                                    mandrilTooling = result7[0].Tooling
                                    mandrilProcesos = result8[0].Procesos
                                    mandrilCalidad = result9[0].Calidad

                                    res.render('mandriles.ejs', {
                                        user: user, data: result2, data2: { mandrilProceso, mandrilRechazado, mandrilLiberado }, data3: { mandrilLanzamientos, mandrilTooling, mandrilProcesos, mandrilCalidad }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });


};


controller.guardar_notificar_POST = (req, res) => {

    correo = req.body.correo
    dep1 = req.body.dep1
    if (dep1 == undefined) {
        dep1 = 0
    }
    dep2 = req.body.dep2
    if (dep2 == undefined) {
        dep2 = 0
    }
    dep3 = req.body.dep3
    if (dep3 == undefined) {
        dep3 = 0
    }
    dep4 = req.body.dep4
    if (dep4 == undefined) {
        dep4 = 0
    }
    dep5 = req.body.dep5
    if (dep5 == undefined) {
        dep5 = 0
    }
    dep6 = req.body.dep6
    if (dep6 == undefined) {
        dep6 = 0
    }
    dep7 = req.body.dep7
    if (dep7 == undefined) {
        dep7 = 0
    }



    funcion.controllerInsertNotificar(dep1, dep2, dep3, dep4, dep5, dep6, dep7, correo, (err, result) => {
        let user = req.connection.user
        funcionE.empleadosTodos((err, result) => {
            if (err) throw err;

            funcion.controllerNotificar((err, result2) => {
                if (err) throw err;


                res.render('notificar.ejs', {
                    user: user, data: result, data2: result2
                });
            });
        });

    });

};


controller.eliminar_notificar_POST = (req, res) => {

    let user = req.connection.user
    correo = req.body.correo2

    funcion.controllerDeleteNotificar(correo, (err, result3) => {
        if (err) throw err;

        funcionE.empleadosTodos((err, result) => {
            if (err) throw err;

            funcion.controllerNotificar((err, result2) => {
                if (err) throw err;


                res.render('notificar.ejs', {
                    user: user, data: result, data2: result2
                });
            });
        });
    });

};

controller.guardar_espera_POST = (req, res) => {
    access = false;
    area = 0;
    areastring = '';
    idMandril = req.body.idmandrill
    consecutivo = req.body.consecutivo
    let user = req.connection.user

    for (let i = 0; i < req.connection.userGroups.length; i++) {
        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Lanzamientos') {
            access = true;
            area = 1;
            areastring = 'Lanzamientos'
            break;
        } else
            if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Tooling') {
                access = true;
                area = 2;
                areastring = 'Tooling'
                break;
            } else
                if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Procesos') {
                    access = true;
                    area = 3;
                    areastring = 'Procesos'
                    break;
                } else
                    if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Procesos_Extrusion') {
                        access = true;
                        area = 4;
                        areastring = 'Procesos_Extrusion'
                        break;
                    } else
                        if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Calidad') {
                            access = true;
                            area = 5;
                            areastring = 'Calidad'
                            break;
                        } else
                            if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Calidad_Ensamble') {
                                access = true;
                                area = 6;
                                areastring = 'Calidad_Ensamble'
                                break;
                            } else
                                if (req.connection.userGroups[i].toString() == 'TFT\\TFT.DEL.PAGES_Mandriles_Produccion') {
                                    access = true;
                                    area = 7;
                                    areastring = 'Produccion'

                                }
    }


    if (access == true) {

        funcion.UpdateEspera(idMandril, consecutivo, (err, result) => {
            if (err) throw err;
        });

        if (area == 1) {
            funcion.controllerTablaStatusLanzamientos((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 2) {
            funcion.controllerTablaStatusTooling((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 3) {
            funcion.controllerTablaStatusProcesos((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 4) {
            funcion.controllerTablaStatusProcesos_Extrusion((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 5) {
            funcion.controllerTablaStatusCalidad((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        } else if (area == 6) {
            funcion.controllerTablaStatusCalidad_Ensamble((err, result2) => {
                if (err) throw err;

                res.render('status_mandriles.ejs', {
                    data: result2, user: user, areastring: areastring
                });
            });
        }



    } else {
        res.render('acceso_denegado.ejs', {
            user: user
        });
    }

};


controller.plano_POST = (req, res) => {

    let user = req.connection.user
    idmandril = req.body.idmandrilp
    idplano = req.body.idmandrilplano
    areaplano = req.body.areaplano
    tipo = req.body.tipo

    //<!--08/04/2020-->
    idmandrill = req.body.idmandrill
    consecutivo = req.body.consecutivo
    actividad = req.body.actividad
    descripcion = req.body.descripcion
    numeroplano=req.body.numeroplano
    //<!--08/04/2020-->

    mandril_id = idmandril.substring(0, idmandril.indexOf("-"));
    mandril_consec = idmandril.substring(idmandril.lastIndexOf("-") + 1)


    funcion.SelectInfoPlano(mandril_id, mandril_consec, (err, result) => {
        if (err) throw err;



        res.render('plano.ejs', {
            user: user, idmandril, idplano, areaplano, data: result, tipo, idmandrill, consecutivo, actividad, descripcion,numeroplano
        });
    });

};

//today
controller.reemplazar_plano_POST = (req, res) => {

    let user = req.connection.user
    username = user.substring(3);
    let idplano = req.body.idmandrilplano
    let idmandril = req.body.idmandril
    let fileUploader = req.files.fileUploader;
    let comentario = req.body.comentario

    areaplano = req.body.areaplano;

    mandril_id = idmandril.substring(0, idmandril.indexOf("-"));
    mandril_consec = idmandril.substring(idmandril.lastIndexOf("-") + 1)

    numplano = idplano.substring(idplano.lastIndexOf("-") + 1)

    POpenDiametroMinimo = req.body.OpenDiametroMinimo
    POpenDiametroMaximo = req.body.OpenDiametroMaximo
    POpenEspesorMinimo = req.body.OpenEspesorMinimo
    POpenEspesorMaximo = req.body.OpenEspesorMaximo
    PInterDiametroMinimo = req.body.InterDiametroMinimo
    PInterDiametroMaximo = req.body.InterDiametroMaximo
    PBossDiametroMinimo = req.body.BossDiametroMinimo
    PBossDiamentroMaximo = req.body.BossDiametroMaximo
    PBossEspesorMinimo = req.body.BossEspesorMinimo
    PBossEspesorMaximo = req.body.BossEspesorMaximo





    fileUploader.mv('D:/DEL/liberacion_mandriles/' + idplano + '.pdf', function (err) {
        if (err)
            return res.status(500).send(err);
    });

    //Cambio de plano Histtorial

    funcion.SelectMandrilesPlano(mandril_id, numplano, (err, resultMandriles) => {


        for (let i = 0; i < resultMandriles.length; i++) {
            funcion.controllerInsertMandrilHistorial(mandril_id, resultMandriles[i].mandril_consec, username, 12, comentario, "Cambio de Plano", (err, result2) => {

            });
        }

    });


    funcion.controllerUpdateInfoPlano(mandril_id,
        POpenDiametroMinimo,
        POpenDiametroMaximo,
        POpenEspesorMinimo,
        POpenEspesorMaximo,
        PInterDiametroMinimo,
        PInterDiametroMaximo,
        PBossDiametroMinimo,
        PBossDiamentroMaximo,
        PBossEspesorMinimo,
        PBossEspesorMaximo,
        numplano, (err, result2) => {
            if (err) throw err;
            funcion.UpdateCambioPlano(mandril_id, mandril_consec, (err, result) => {
                if (err) throw err;

                funcion.SelectInfoPlano(mandril_id, mandril_consec, (err, result) => {
                    if (err) throw err;

                    res.render('plano.ejs', {
                        user: user, idmandril, idplano, areaplano, data: result, tipo
                    });
                });
            });
        });




    /////////////////////////////////////////////////////////////////////////////

    funcion.controllerInfoMandril(mandril_id, mandril_consec, (err, mandril) => {
        if (err) throw err;

        funcion.controllerCorreosAll((err, correo) => {
            for (var i = 0; i < correo.length; i++) {

                to = correo[i].correo;
                cc = '';
                subject = 'Liberación de Mandriles: #' + mandril_id + ' Parte: ' + mandril.mandril_numparte + ' Plataforma: ' + mandril.mandril_plat + ' Familia: ' + mandril.mandril_fam
                status = 'Cambio de Plano';
                id = mandril_id
                parte = mandril.mandril_numparte
                plataforma = mandril.mandril_plat
                familia = mandril.mandril_fam
                prioridad = mandril.mandril_prioridad
                user = user
                comentario = ""
                activSiguiente = ''
                activAnterior = ""
                color = '#dc3545'
                colorA = '#dc3545'
                estado = 'Cambio de Plano'

                dataEmail = {
                    to, cc, subject, status, parte, plataforma, familia, prioridad, id, user, comentario, activSiguiente, activAnterior, color, colorA, estado
                }

                funcion.sendEmail(dataEmail);
            }
        });
    });


    //////////////////////////////////////////////////////////////////////////////


};


controller.mandril_info_POST = (req, res) => {
    let user = req.connection.user
    id = req.body.idmandrilInfo
    mandril_id = id.substring(0, id.indexOf("-"));
    mandril_consec = id.substring(id.lastIndexOf("-") + 1)
    mandrilStatus = req.body.mandrilStatus
    classColor = req.body.classColor



    if (mandrilStatus > 9) {
        funcion.SelectInfoMandril(mandril_id, mandril_consec, (err, result) => {
            if (err) throw err;
            funcion.SelectInfoReporte(mandril_id, mandril_consec, (err, result2) => {
                if (err) throw err;
                funcion.SelectInfoPlano(mandril_id, mandril_consec, (err, result3) => {
                    if (err) throw err;

                    funcion.FechaAlta(mandril_id, mandril_consec, (err, result4) => {
                        if (err) throw err;
                        funcion.FechaLiberacion(mandril_id, mandril_consec, (err, result5) => {
                            if (err) throw err;



                            res.render('revisar.ejs', {
                                user: user, data: result, data2: result2, data3: result3[0], mandrilStatus, fechaAlta: result4, fechaLiberacion: result5, classColor: classColor
                            });
                        });
                    });
                });
            });
        });
    } else {

        funcion.SelectInfoMandril(mandril_id, mandril_consec, (err, result) => {
            if (err) throw err;
            funcion.SelectInfoReporte(mandril_id, mandril_consec, (err, result2) => {
                if (err) throw err;
                funcion.SelectInfoPlano(mandril_id, mandril_consec, (err, result3) => {
                    if (err) throw err;


                    res.render('revisar.ejs', {
                        user: user, data: result, data2: result2, data3: result3[0], mandrilStatus, fechaAlta: "", fechaLiberacion: ""
                    });
                });
            });
        });
    }


};

controller.historial_info_POST = (req, res) => {
    let user = req.connection.user
    idHistorial = req.body.idHistorial


    funcion.SelectHistorialInfo(idHistorial, (err, result) => {
        if (err) throw err;

        res.render('historial_info.ejs', {
            user: user, data: result
        });
    });



};


controller.consulta_mandril_GET = (req, res) => {

    
    mandril = req.params.id;
    
    funcion.getInfoMandril(mandril, (err, result) => {
        if (err) throw err;
           
            res.send(result);
        });
  
};







module.exports = controller;
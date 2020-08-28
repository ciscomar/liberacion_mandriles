const funcion = {};
const express = require('express');
const app = express();
mail_config = require('../email/conn.js');
var mailer = require('express-mailer');
mailer.extend(app, mail_config);
var schedule = require('node-schedule');

const db = require('../db/conn');
const dbE = require('../db/connEmpleados');
const dbA = require('../db/connAreas');

funcion.sendEmail = (dataEmail) => {

    //Enviar Correos
    app.mailer.send('email.ejs', {

        //Info General
        to: dataEmail.to,
        cc: dataEmail.cc,
        subject: dataEmail.subject,
        status: dataEmail.status,
        id: dataEmail.id,
        parte: dataEmail.parte,
        plataforma: dataEmail.plataforma,
        familia: dataEmail.familia,
        prioridad: dataEmail.prioridad,
        user: dataEmail.user,
        comentario: dataEmail.comentario,
        activSiguiente: dataEmail.activSiguiente,
        activAnterior: dataEmail.activAnterior,
        color:dataEmail.color,
        colorA: dataEmail.colorA,
        estado: dataEmail.estado,

    }, function (err) {
        if (err) {
            console.log(err)
            return;
        }
        console.log('mail sent')
    });

};


funcion.sendEmailV = (dataEmail) => {

    //Enviar Correos
    app.mailer.send('emailVencido.ejs', {

        //Info General
        to: dataEmail.to,
        cc: dataEmail.cc,
        subject: dataEmail.subject,
        vencidos: dataEmail.vencidos,


    }, function (err) {
        if (err) {
            console.log(err)
            return;
        }
        console.log('mail sent')
    });

};


funcion.controllerPlataformas = (callback) => {
    dbA.query(`SELECT subarea FROM areas_subarea WHERE id_area=4`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerInsertMandril = (id,consecutivo, numparte, plat,cliente,motivo,tipo, prioridad, plano,revision,  callback) => {
    db.query(`
    INSERT INTO mandril_info (mandril_id,mandril_consec, mandril_numparte, mandril_plat,mandril_cliente,mandril_motivo,mandril_tipo, mandril_fam, mandril_lgreen, mandril_lvulca,mandril_ufecha, mandril_status, mandril_estado, mandril_prioridad, mandril_plano, mandril_revision, mandril_activo, mandril_cmm)
    VALUES( '${id}', ${consecutivo}, '${numparte}', '${plat}','${cliente}', '${motivo}', '${tipo}' ,'', '','', NOW(), '2','Proceso','${prioridad}', ${plano},'${revision}', 'Activo',0)`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerInsertReporte= (id,consecutivo, callback) => {
    db.query(`
    INSERT INTO mandril_reporte (mandril_id,mandril_consec, IDE, ODE,BDE,ODI, BDI, OEsp, BEsp,CODI,CBDI,COEsp,CBEsp,COG,CBG,fix_muescas, fix_tejido, fix_longitud, fix_ruta, fix_tapa, fix_ensamblaje, fix_goma, fix_verificar)
    VALUES( '${id}', ${consecutivo}, '', '', '', '' ,'', '','','','','','','','','','','','','','','','')`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}


funcion.controllerInsertInfoPlano = (id,consecutivo, POpenDiametroMinimo,         
    POpenDiametroMaximo,        
    POpenEspesorMinimo,        
    POpenEspesorMaximo,         
    PInterDiametroMinimo,         
    PInterDiametroMaximo,        
    PBossDiametroMinimo,        
    PBossDiamentroMaximo,         
    PBossEspesorMinimo,         
    PBossEspesorMaximo,numplano,  callback) => {
    db.query(`
    INSERT INTO mandril_plano (mandril_id,mandril_consec, ODiamMin, ODiamMax, OEspMin, OEspMax, IDiamMin, IDiamMax, BDiamMin, BDiamMax, BEspMin, BEspMax, mandril_plano)
    VALUES( '${id}', ${consecutivo}, '${POpenDiametroMinimo}', '${POpenDiametroMaximo}' ,'${POpenEspesorMinimo}','${POpenEspesorMaximo}','${PInterDiametroMinimo}' ,'${PInterDiametroMaximo}' ,'${PBossDiametroMinimo}' ,'${PBossDiamentroMaximo}' ,'${PBossEspesorMinimo}' ,'${PBossEspesorMaximo}', ${numplano})`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}


funcion.controllerUpdateInfoPlano = (id, POpenDiametroMinimo,         
    POpenDiametroMaximo,        
    POpenEspesorMinimo,        
    POpenEspesorMaximo,         
    PInterDiametroMinimo,         
    PInterDiametroMaximo,        
    PBossDiametroMinimo,        
    PBossDiamentroMaximo,         
    PBossEspesorMinimo,         
    PBossEspesorMaximo,
    numplano,  
    callback) => {
    db.query(`
    UPDATE mandril_plano SET 
    ODiamMin='${POpenDiametroMinimo}', 
    ODiamMax='${POpenDiametroMaximo}', 
    OEspMin='${POpenEspesorMinimo}', 
    OEspMax='${POpenEspesorMaximo}', 
    IDiamMin='${PInterDiametroMinimo}', 
    IDiamMax='${PInterDiametroMaximo}', 
    BDiamMin='${PBossDiametroMinimo}', 
    BDiamMax='${PBossDiamentroMaximo}', 
    BEspMin='${PBossEspesorMinimo}', 
    BEspMax='${PBossEspesorMaximo}' WHERE mandril_id='${id}' AND  mandril_plano=${numplano}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}


funcion.controllerTablaStatusLanzamientos = (callback) => {
    db.query(`SELECT * FROM mandril_info, mandril_actividades
    WHERE ( mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND (mandril_status = 3 || mandril_status=5 && mandril_tipo="Prototipo" || mandril_status= 9 && mandril_tipo="Prototipo" || 
        mandril_status=10 && mandril_tipo="Prototipo" || mandril_status=11 && mandril_tipo="Prototipo") AND mandril_activo="Activo"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaStatusTooling = (callback) => {
    db.query(`SELECT * FROM mandril_info, mandril_actividades
    WHERE ( mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND (mandril_status = 2 || mandril_status = 4 || mandril_status = 7) AND mandril_activo="Activo"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaStatusProcesos = (callback) => {
    db.query(`SELECT * FROM mandril_info, mandril_actividades
    WHERE ( mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND (mandril_status = 5 && mandril_tipo !="Prototipo" ||  mandril_status = 11 && mandril_tipo !="Prototipo" || mandril_status = 9 && mandril_tipo !="Prototipo" ) AND mandril_activo="Activo"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaStatusProcesos_Extrusion = (callback) => {
    db.query(`SELECT * FROM mandril_info, mandril_actividades
    WHERE ( mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND (mandril_status = 10 && mandril_tipo !="Prototipo" ) AND mandril_activo="Activo"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaStatusCalidad = (callback) => {
    db.query(`SELECT * FROM mandril_info, mandril_actividades
    WHERE ( mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND (mandril_status = 6 ) AND mandril_activo="Activo"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaStatusCalidad_Ensamble = (callback) => {
    db.query(`SELECT * FROM mandril_info, mandril_actividades
    WHERE ( mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND (mandril_status = 8 ) AND mandril_activo="Activo"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaStatusProduccion = (callback) => {
    db.query(`SELECT * FROM mandril_info, mandril_actividades
    WHERE ( mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND ( mandril_status = 14 || mandril_status = 19 ) AND mandril_activo="Activo"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerAllMandriles = (callback) => {
    db.query(`SELECT * FROM mandril_info`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerInsertMandrilHistorial = (id,consecutivo, empleado, activ, comentario, status, callback) => {
    db.query(`
    INSERT INTO mandril_historial (hist_mandril,hist_consec, hist_empleado, hist_activ, hist_comentario, hist_status, hist_fecha )
    VALUES( '${id}',${consecutivo}, '${empleado}', '${activ}' ,'${comentario}','${status}', NOW())`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerHistorial = (mandril_id, mandril_consec, callback) => {
    db.query(`SELECT * FROM mandril_historial, mandril_actividades, aprobacion_areas
    WHERE ( mandril_historial.hist_activ = mandril_actividades.activ_seq)
    AND ( mandril_actividades.activ_area = aprobacion_areas.area_id)
    AND (hist_mandril=${mandril_id} )
    AND (hist_consec=${mandril_consec}) ORDER BY mandril_historial.hist_id DESC `, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaMandriles = (callback) => {
    db.query(`SELECT * FROM mandril_info, mandril_actividades, aprobacion_areas
    WHERE ( mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND (aprobacion_areas.area_id=mandril_actividades.activ_area) ORDER BY mandril_activo ASC`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })
}

funcion.controllerUpdateMandrilStatus = (id,consecutivo, nextActividad, estado, callback) => {
    db.query(`UPDATE mandril_info SET 
    mandril_status= "${nextActividad}",
    mandril_ufecha= NOW(),
    mandril_estado='${estado}'
    WHERE mandril_id = ${id}
    AND mandril_consec=${consecutivo}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerUpdateCmm = (id,consecutivo, cmm, callback) => {
    db.query(`UPDATE mandril_info SET 
    mandril_cmm= ${cmm}
    WHERE mandril_id = ${id}
    AND mandril_consec=${consecutivo}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.UpdateCambioPlano= (id, idplano, callback) => {
    db.query(`UPDATE mandril_info SET 
    mandril_status= "2",
    mandril_ufecha= NOW(),
    mandril_estado='Rechazado'
    WHERE mandril_id = ${id}
    AND mandril_plano=${idplano}
    AND mandril_estado="Proceso"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}


funcion.controllerCountMandrilesAll = (as, status, callback) => {
    db.query(`SELECT COUNT(*) AS ${as} FROM mandril_info WHERE mandril_estado="${status}" AND mandril_activo="Activo"`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerCountMandrilAreaL = (callback) => {
    db.query(`SELECT COUNT(*) AS 'Lanzamientos' FROM mandril_info WHERE 
     mandril_status = '3' AND mandril_activo="Activo"
      `, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}


funcion.SelectMandrilesPlano = (idmandril, idplano, callback) => {
    db.query(`SELECT mandril_consec FROM mandril_info WHERE mandril_id='${idmandril}' && mandril_plano=${idplano} `, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {
                
                callback(null, result);
            }
        })

}

funcion.controllerCountMandrilAreaT = (callback) => {
    db.query(`SELECT COUNT(*) AS 'Tooling' FROM mandril_info WHERE 
     mandril_status = '2'
     || mandril_status = '4'
     || mandril_status = '7'
     AND mandril_activo="Activo"
      `, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerCountMandrilAreaPs = (callback) => {
    db.query(`SELECT COUNT(*) AS 'Procesos' FROM mandril_info WHERE 
     mandril_status = '5'
     || mandril_status = '9'
     || mandril_status = '10'
     || mandril_status = '11'
     AND mandril_activo="Activo"
      `, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerCountMandrilAreaC = (callback) => {
    db.query(`SELECT COUNT(*) AS 'Calidad' FROM mandril_info WHERE 
     mandril_status = '6'
     || mandril_status = '8'
     AND mandril_activo="Activo"
      `, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}


funcion.controllerNotificar = (callback) => {
    db.query(`SELECT * FROM mandril_notificar ORDER BY correo`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })
}

funcion.controllerInsertNotificar = (dep1, dep2, dep3, dep4, dep5, dep6, dep7, correo, callback) => {

    db.query(`INSERT INTO mandril_notificar (correo, dep1, dep2, dep3, dep4, dep5, dep6, dep7)
    VALUES('${correo}',${dep1}, ${dep2}, ${dep3}, ${dep4}, ${dep5}, ${dep6}, ${dep7})`, function (err, result, fields) {

            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}

funcion.controllerDeleteNotificar = (correo, callback) => {

    db.query(`DELETE FROM mandril_notificar WHERE correo='${correo}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}


funcion.controllerAreaActividad = (actividad, callback) => {

    db.query(`SELECT * FROM mandril_actividades WHERE activ_seq = '${actividad}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
        }
    })

}

funcion.controllerCorreosArea = (actividad, callback) => {

    db.query(`SELECT correo FROM mandril_notificar WHERE dep${actividad} = 1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerCorreosAll = ( callback) => {

    db.query(`SELECT correo FROM mandril_notificar WHERE dep1<2 AND dep2<2 AND dep3<2 AND dep4<2 AND dep5<2 AND dep6<2 AND dep7<2  `, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            console.log(result)
            callback(null, result);
        }
    })

}

funcion.controllerInfoMandril = (id, consecutivo, callback) => {

    db.query(`SELECT * FROM mandril_info WHERE mandril_id = '${id}' AND mandril_consec = '${consecutivo}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            
            callback(null, result[0]);
        }
    })

}

funcion.controllerActividad = (actividad, callback) => {

    db.query(`SELECT activ_descripcion FROM mandril_actividades WHERE activ_seq= '${actividad}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            
            callback(null, result[0].activ_descripcion);
        }
    })

}

funcion.controllerLastConsecutivo = (id, callback) => {

    db.query(`SELECT mandril_consec
    FROM mandril_info
    WHERE mandril_id='${id}'
    ORDER BY mandril_consec DESC
    LIMIT 1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            if(result !=''){
            callback(null, result[0].mandril_consec);
            }else{
                callback(null, 0);
            }
        }
    })

}

funcion.controllerLastPlano= (id, callback) => {

    db.query(`SELECT mandril_plano
    FROM mandril_info
    WHERE mandril_id='${id}'
    ORDER BY mandril_plano DESC
    LIMIT 1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            if(result !=''){
            callback(null, result[0].mandril_plano);
            }else{
                callback(null, 0);
            }
        }
    })
}


funcion.controllerLastCmm= (id, callback) => {

    db.query(`SELECT mandril_cmm
    FROM mandril_info
    WHERE mandril_id='${id}'
    ORDER BY mandril_cmm DESC
    LIMIT 1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            if(result !=''){
            callback(null, result[0].mandril_cmm);
            }else{
                callback(null, 0);
            }
        }
    })
}

funcion.UpdateEspera = (idMandril,consecutivo, callback) => {
    db.query(`UPDATE mandril_info SET
    mandril_estado='Espera'
    WHERE mandril_id = '${idMandril}'
    AND mandril_consec= ${consecutivo}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerUpdateInfo = (mandril_id, mandril_consec,newInfo, update, callback) => {
    db.query(`UPDATE mandril_info SET 
    mandril_${update}= "${newInfo}"
    WHERE mandril_id = ${mandril_id}
    AND mandril_consec=${mandril_consec}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerUpdateReporte = (mandril_id, mandril_consec,IDE, ODE, BDE, ODI, BDI,OEsp, BEsp, callback) => {
    db.query(`UPDATE mandril_reporte SET 
    IDE= '${IDE}',
    ODE= '${ODE}',
    BDE= '${BDE}',
    ODI= '${ODI}',
    BDI= '${BDI}',
    OEsp= '${OEsp}',
    BEsp= '${BEsp}'
    WHERE mandril_id = '${mandril_id}'
    AND mandril_consec=${mandril_consec}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })
}

funcion.controllerUpdateReporteCalidad = (mandril_id, mandril_consec, CODI, CBDI, COEsp, CBEsp, COG, CBG, callback) => {
    db.query(`UPDATE mandril_reporte SET 
    CODI= '${CODI}',
    CBDI= '${CBDI}',
    COEsp= '${COEsp}',
    CBEsp= '${CBEsp}',
    COG= '${COG}',
    CBG= '${CBG}'
    WHERE mandril_id = '${mandril_id}'
    AND mandril_consec=${mandril_consec}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })
}

funcion.controllerUpdateReporteCalidadEnsamble = (mandril_id, mandril_consec,fix_muescas, fix_tejido, fix_longitud, fix_ruta, fix_tapa, fix_ensamblaje, fix_goma, fix_verificar, callback) => {
    db.query(`UPDATE mandril_reporte SET 
    fix_muescas= '${fix_muescas}',
    fix_tejido= '${fix_tejido}',
    fix_longitud= '${fix_longitud}',
    fix_ruta= '${fix_ruta}',
    fix_tapa= '${fix_tapa}',
    fix_ensamblaje= '${fix_ensamblaje}',
    fix_goma= '${fix_goma}',
    fix_verificar= '${fix_verificar}'
    WHERE mandril_id = '${mandril_id}'
    AND mandril_consec=${mandril_consec}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })
}



funcion.SelectInfoPlano= (id,consec, callback) => {

    db.query(`SELECT *
    FROM mandril_plano
    WHERE mandril_id='${id}' AND mandril_consec='${consec}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })
}

funcion.SelectInfoReporte= (id,consec, callback) => {

    db.query(`SELECT *
    FROM mandril_reporte
    WHERE mandril_id='${id}' AND mandril_consec='${consec}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

          
            callback(null, result[0]);
        }
    })
}

funcion.SelectInfoMandril= (id,consec, callback) => {

    db.query(`SELECT *
    FROM mandril_info
    WHERE mandril_id='${id}' AND mandril_consec='${consec}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

          
            callback(null, result[0]);
        }
    })
}

funcion.SelectHistorialInfo= (id, callback) => {

    db.query(`SELECT *
    FROM mandril_historial, mandril_actividades
    WHERE mandril_historial.hist_activ = mandril_actividades.activ_seq 
    AND mandril_historial.hist_id='${id}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

         
            callback(null, result[0]);
        }
    })
}


funcion.FechaAlta= (id,consec, callback) => {
    db.query(`SELECT hist_fecha
    FROM mandril_historial
    WHERE hist_mandril='${id}' AND hist_consec='${consec}'
    AND hist_activ=1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

          
            callback(null, result[0].hist_fecha);
        }
    })
}


funcion.FechaLiberacion= (id,consec, callback) => {
    db.query(`SELECT hist_fecha
    FROM mandril_historial
    WHERE hist_mandril='${id}' AND hist_consec='${consec}'
    AND hist_activ=8 AND hist_status='Actividad Liberada' 
    ORDER BY hist_id DESC LIMIT 1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

          
            callback(null, result[0].hist_fecha);
        }
    })
}


funcion.selectAllLiberar= (id,actividad,numeroplano, callback) => {
    db.query(`SELECT *
    FROM mandril_info
    WHERE mandril_id='${id}' AND mandril_status='${actividad}'
    AND mandril_plano=${numeroplano}`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

          
            callback(null, result);
        }
    })
}

funcion.getInfoMandril= (mandril, callback) => {
    db.query(`SELECT *
    FROM mandril_info, mandril_plano WHERE mandril_info.mandril_id = mandril_plano.mandril_id
     AND mandril_info.mandril_id='${mandril}' ORDER BY mandril_info.mandril_reg DESC LIMIT 1`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

          
            callback(null, result);
        }
    })
}


funcion.UpdateObsoleto= (idmandril, callback) => {
    db.query(`UPDATE mandril_info SET mandril_activo="Obsoleto" WHERE mandril_id='${idmandril}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

          
            callback(null, result);
        }
    })
}


funcion.sendNotificacion = (actividad) => {
    let vencidos = [];


    


    db.query(`SELECT * FROM mandril_info, mandril_actividades 
    WHERE ( mandril_info.mandril_status = ${actividad.activ_seq} AND mandril_info.mandril_status = mandril_actividades.activ_seq)
    AND mandril_info.mandril_estado !='Liberado' AND mandril_info.mandril_activo= 'Activo' `, function (err, mandriles, fields) {
        if (err) {
            console.log(err)
        } else {

            if (mandriles.length > 0) {
        

                for (let i = 0; i < mandriles.length; i++) {
                    let fechaUltima
                    fechaUltima = mandriles[i].mandril_ufecha;

                    let hoy = new Date();
                    let seconds = (hoy.getTime() - fechaUltima.getTime()) / 1000;
                    let minutos = (seconds / 60);
                    let horas = (minutos / 60);
                    let dias = Math.round((horas / 24));

                    if(dias>= actividad.activ_dias){

                        vencidos.push(mandriles[i])
                    }


                }

     

               if (vencidos.length > 0) {

                    db.query(`SELECT correo FROM mandril_notificar WHERE dep${vencidos[0].activ_area}>=1`, function (err, resultc, fields) {

                        for (let i = 0; i < resultc.length; i++) {

                            to = resultc[i].correo;
                            cc = '';
                            subject = 'Liberacion de Mandriles - Mandriles Detenidos';
                            vencidos = vencidos;


                            dataEmail = {
                                to, cc, subject, vencidos
                            }

                            funcion.sendEmailV(dataEmail);

                        }
                    })
               }
            }
        }
    })
}




//Enviar correos cada determinado tiempo
var rule = new schedule.RecurrenceRule();
rule.hour = 7;
rule.minute = 0;
rule.second = 0;

schedule.scheduleJob(rule, function () {


    db.query(`SELECT * FROM mandril_actividades`, function (err, actividad, fields) {

        for (let i = 0; i < actividad.length; i++) {

            funcion.sendNotificacion(actividad[i]);
        }

    })
});




module.exports = funcion;
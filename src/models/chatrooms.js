const pool = require('../config/database');
const ProductModel = require('../models/product.js');
const Users = require('../models/users.js');
const notificationModel = require('../models/notifications.js');

const date = require('date-and-time');

let chatroomsModel = {};

//Crear una nueva Sala de chat
chatroomsModel.newChatRooms = (IdSAla, userOffer, userPublication, idPublication, hoy, OfferData, Status) => {
    return new Promise(async (resolve, reject) => {
        if (pool) {
            // console.log(OfferData);
            // console.log(hoy);
            let Existe = await chatroomsModel.SalaExist(IdSAla, userPublication, userOffer, idPublication, OfferData);
            // console.log("Existe.Exist");
            // console.log(Existe.Exist);
            if (Existe.Exist == false) {
                pool.query(
                    'INSERT INTO chatrooms (id,iduserpublication,iduseroffer,idpubliction,idoffer,datecreated,status) VALUES ("' + IdSAla + '","' + userPublication + '","' + userOffer + '",' + idPublication + ',"' + OfferData + '","' + hoy + '",' + Status + ')',
                    (err, result) => {
                        //console.log(err);
                        // console.log(result);
                        if (err) {
                            console.log(err);
                            resolve({
                                'error': err
                            })
                        } else {
                            //console.log(result);
                            resolve({
                                'result': result
                            })
                        }

                    }
                )
            } else {

                resolve({
                    'result': Existe.result,
                    'Exist': Existe.Exist,
                    'sala': Existe.idSala
                })
            }
            //return resultado;
        }
    })
};

chatroomsModel.SalaExist = (IdSAla, iduserpublication, iduseroffer, idpubliction, idoffer) => {
    return new Promise((resolve, reject) => {
        if (pool) {
            //let Puntuar={};
            //console.log("SELECT * FROM product where id="+idPublication);
            pool.query(
                'SELECT * FROM `chatrooms` WHERE  iduserpublication=? AND iduseroffer=? AND idpubliction=? AND idoffer=?', [
                iduserpublication,
                iduseroffer,
                idpubliction,
                idoffer
            ],
                (err, result) => {


                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {
                        let E = false;
                        let id = IdSAla;
                        // console.log("result");
                        // console.log(result);
                        if (result.length != 0) {
                            E = true;
                            id = result[0].id;
                        }
                        resolve({
                            'Exist': E,
                            'result': result,
                            'idSala': id
                        })
                    }

                }
            )
            //return resultado;
        }
    })

}

//Crear una nueva Sala de chat
chatroomsModel.ExistChatRooms = (IdSAla) => {
    return new Promise((resolve, reject) => {
        if (pool) {
            pool.query(
                'SELECT * FROM chatrooms WHERE id=?', IdSAla,
                (err, result) => {
                    //console.log(err);
                    // console.log(result);
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {
                        //console.log(result);
                        resolve({
                            'result': result[0]
                        })
                    }

                }
            )
            //return resultado;
        }
    })
};


//listDataChatRoom - Listar toda la informaci??n de la sala de chat
chatroomsModel.listDataChatRoom = (idSala, idUser) => {
    return new Promise((resolve, reject) => {
        if (pool) {
            let armaresult = {};
            pool.query(
                'SELECT cr.id AS idSala,cr.status,cr.iduserpublication,cr.iduseroffer,cr.matchpublication,cr.matchoffer,cr.datecreated AS creacionSala,cr.idpubliction,p.name AS namePublication,p.typepublication,p.marketvalue AS ValorPublication,cr.iduserpublication,u2.fullname AS nameUserPublication, u2.imgurl AS imgUserPublication ,cr.idoffer,cr.iduseroffer AS UserOferta,u.fullname AS nameUserOferta,u.imgurl AS imgUserOferta FROM chatrooms AS cr INNER JOIN users AS u ON cr.iduseroffer=u.id INNER JOIN users AS u2 ON cr.iduserpublication=u2.id INNER JOIN product AS p ON cr.idpubliction=p.id WHERE cr.id="' + idSala + '"',
                async (err, result) => {
                    //console.log(err);
                    // console.log(result);
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {
                        armaresult = await chatroomsModel.armaresult3(result);

                        //console.log(element);
                        let isUserPubli = false;
                        let match = 0;
                        let matchpublication = result[0].matchpublication;
                        let matchoffer = result[0].matchoffer;

                        if (result[0].iduserpublication == idUser) {
                            isUserPubli = true;
                        }
                        if (result[0].iduseroffer == idUser) {
                            isUserPubli = false;
                        }
                        console.log(isUserPubli);
                        //NINGUN USUARIO HA HECHO MATCH
                        if (matchpublication != 1 && matchoffer != 1) {
                            match = 0;
                        }
                        //LOS DOS USUARIOS HAN HECHO MATCH
                        if (matchpublication == 1 && matchoffer == 1) {
                            match = 3;
                        }
                        console.log(isUserPubli);
                        if (isUserPubli == true) {
                            if (matchpublication == 1 && matchoffer != 1) {
                                match = 1; //EL USUARIO HIZO MATCH
                            }
                            else if (matchoffer == 1 && matchpublication != 1) {
                                match = 2;//EL OTRO USUARIO HIZO MATCH

                            }
                            console.log(match);
                        }
                        else {
                            if (matchpublication != 1 && matchoffer == 1) {
                                match = 1; //EL USUARIO HIZO MATCH
                            }
                            else if (matchoffer == 1 && matchpublication != 1) {
                                match = 2;//EL OTRO USUARIO HIZO MATCH

                            }
                            console.log(match);
                        }
                        //match=false;

                        // console.log("match");
                        // console.log(match);
                        // console.log("match");

                        //armaresult['isUserPubli']=isUserPubli;
                        //armaresult['match']=match;
                        armaresult[0]['isUserPubli'] = isUserPubli;
                        armaresult[0]['match'] = match;
                        // console.log(armaresult);
                        resolve({
                            'result': armaresult
                        })
                    }

                }
            )
            //return resultado;
        }
    })
};

chatroomsModel.armaresult3 = (result) => {

    return new Promise(async (resolve, reject) => {
        let arr = [];
        try {
            let img = {};
            let prefe = {};
            //console.log(result);
            for (const element of result) {
                img = await chatroomsModel.ListItemsOffers(element.idpubliction, element.ValorPublication);
                prefe = await chatroomsModel.ListPrefrencesProduct(element.idpubliction);
                ItemOfer = await chatroomsModel.ListItemsOffers(element.idoffer, element.ValorPublication)
                let Precio = Number.parseFloat(element.ValorPublication).toFixed(4);

                let now = new Date();
                let servidor = date.format(now, 'DD/MM/YYYY');
                //let registro=element.registro;
                let registro = new Date(element.creacionSala);
                let regis = date.format(registro, 'DD/MM/YYYY');

                //console.log(now+" - "+registro);

                let comprobar_fecha = date.isSameDay(now, registro);
                // console.log(comprobar_fecha+" - ");
                // console.log("//////");
                let nuevo = false;
                if (registro == servidor) {
                    let nuevo = true;
                } else {
                    let nuevo = false;
                }




                arr.push({
                    "idSala": element.idSala,
                    "status": element.status,
                    "datecreated": regis,
                    "idPublicacion": element.idpubliction,
                    "typepublication": element.typepublication,
                    "namePublication": element.namePublication,
                    "ValorPublication": Number.parseFloat(element.ValorPublication).toFixed(4),
                    "Userpublication": element.iduserpublication,
                    "nameUserPublication": element.nameUserPublication,
                    "imgUserPublication": element.imgUserPublication,
                    "idoferta": element.idoffer,
                    "iduseroferta": element.iduseroffer,
                    "UserOferta": element.UserOferta,
                    "nameUserOferta": element.nameUserOferta,
                    "imgUserOferta": element.imgUserOferta,
                    "ProductImagesPublicacion": img.ImagesProduct,
                    "PreferencesPublicacion": prefe.Preferences,
                    "aFavor": ItemOfer.aFavor,
                    "Valorferta": Number.parseFloat(ItemOfer.Valorferta).toFixed(4),
                    "dieferencia": Number.parseFloat(ItemOfer.DiferenciaOffer).toFixed(4),
                    "ItemOfer": ItemOfer.itemsoffer
                });

            }
            resolve(arr)
        }
        catch (e) {
            console.log(e);
        }
    }
    )

}

///
chatroomsModel.armaresult = (result) => {

    return new Promise(async (resolve, reject) => {
        let arr = [];
        try {
            let img = {};
            let prefe = {};
            //console.log(result);
            for (const element of result) {
                img = await chatroomsModel.ListItemsOffers(element.idpubliction, element.ValorPublication);
                prefe = await chatroomsModel.ListPrefrencesProduct(element.idpubliction);
                ItemOfer = await chatroomsModel.ListItemsOffers(element.idoffer, element.ValorPublication)
                let Precio = Number.parseFloat(element.ValorPublication).toFixed(4);

                let now = new Date();
                let servidor = date.format(now, 'DD/MM/YYYY');
                //let registro=element.registro;
                let registro = new Date(element.creacionSala);
                let regis = date.format(registro, 'DD/MM/YYYY');

                //console.log(now+" - "+registro);

                let comprobar_fecha = date.isSameDay(now, registro);
                // console.log(comprobar_fecha+" - ");
                // console.log("//////");
                let nuevo = false;
                if (registro == servidor) {
                    let nuevo = true;
                } else {
                    let nuevo = false;
                }




                arr.push({
                    "idSala": element.idSala,
                    "status": element.status,
                    "datecreated": regis,
                    "idPublicacion": element.idpubliction,
                    "namePublication": element.namePublication,
                    "ValorPublication": Number.parseFloat(element.ValorPublication).toFixed(4),
                    "Userpublication": element.iduserpublication,
                    "nameUserPublication": element.nameUserPublication,
                    "imgUserPublication": element.imgUserPublication,
                    "idoferta": element.idoffer,
                    "iduseroferta": element.iduseroffer,
                    "UserOferta": element.UserOferta,
                    "nameUserOferta": element.nameUserOferta,
                    "imgUserOferta": element.imgUserOferta,
                    "ProductImagesPublicacion": img.ImagesProduct,
                    "PreferencesPublicacion": prefe.Preferences,
                    "aFavor": ItemOfer.aFavor,
                    "Valorferta": Number.parseFloat(ItemOfer.Valorferta).toFixed(4),
                    "dieferencia": Number.parseFloat(ItemOfer.DiferenciaOffer).toFixed(4),
                    "ItemOfer": ItemOfer.itemsoffer
                });

            }
            resolve(arr)
        }
        catch (e) {
            console.log(e);
        }
    }
    )

}


chatroomsModel.ListImagesProduct = (element) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT  url FROM imgproduct WHERE idproduct=? ', [element],
            (err2, result2) => {

                //console.log(element.id);   
                //console.log(element.namec);   
                //console.log(result2[1].preference);
                if (err2) {
                    resolve({
                        'error': err2
                    })
                } else {
                    //console.log(result2); 
                    // console.log(result2.length);
                    let ImagesProduct = [];
                    for (var atr2 in result2) {
                        ImagesProduct.push(result2[atr2].url);
                    };
                    //console.log(element.idproduct);  
                    // console.log(ImagesProduct);
                    resolve({

                        "ImagesProduct": ImagesProduct
                    });
                }

                //console.log(CatgySubCatg);
                //CatgySubCatg.Subcategory=result2;
                //console.log("//////SUBCATEGOR??A///////");
                // console.log(result2);

            })
    })
}
////////
chatroomsModel.idSala = (element) => {
    return new Promise((resolve, reject) => {
        let idsala = null;
        pool.query(
            'SELECT  id FROM chatrooms WHERE idoffer=? ', [element],
            (err2, result2) => {

                // console.log(result2);   
                //console.log(element.namec);   
                //console.log(result2[1].preference);
                if (err2) {
                    resolve({
                        'Error': err2
                    })
                } else {
                    //console.log(result2); 
                    // console.log(result2.length);
                    // let ImagesProduct= []; 
                    // for(var atr2 in result2){
                    // ImagesProduct.push(result2[atr2].url); 
                    // };  
                    //console.log(element.idproduct);  
                    // console.log(ImagesProduct);
                    if (result2[0] != undefined) {
                        if (result2[0].id) {
                            idsala = result2[0].id;
                        }
                    }

                    resolve({

                        "idSala": idsala
                    });
                }

                //console.log(CatgySubCatg);
                //CatgySubCatg.Subcategory=result2;
                //console.log("//////SUBCATEGOR??A///////");
                // console.log(result2);

            })
    })
}
////////

//listChatRoomStatus - Listar salas de chat seg??n status
chatroomsModel.listChatRoomStatus = (statuSala, idUder) => {
    return new Promise((resolve, reject) => {
        if (pool) {
            let armaresult = {};
            pool.query(
                'SELECT cr.id AS idSala,cr.datecreated AS creacionSala,cr.idpubliction,p.name AS namePublication, p.typepublication,p.marketvalue AS valorComercial,cr.iduserpublication,u2.fullname AS nameUserPublication, u2.imgurl AS imgUserPublication ,cr.idoffer,cr.iduseroffer AS UserOferta,u.fullname AS nameUserOferta,u.imgurl AS imgUserOferta FROM chatrooms AS cr INNER JOIN users AS u ON cr.iduseroffer=u.id INNER JOIN users AS u2 ON cr.iduserpublication=u2.id INNER JOIN product AS p ON cr.idpubliction=p.id WHERE cr.status="' + statuSala + '" AND (cr.iduserpublication="' + idUder + '" OR cr.iduseroffer="' + idUder + '")',
                async (err, result) => {
                    //console.log(err);
                    // console.log(result);
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {
                        armaresult = await chatroomsModel.armaresultStatus(result);
                        resolve({
                            'result': armaresult
                        })
                    }

                }
            )
            //return resultado;
        }
    })
};


///
chatroomsModel.armaresultStatus = (result) => {

    return new Promise(async (resolve, reject) => {
        let arr = [];
        try {
            let img = {};
            let prefe = {};
            //console.log(result);
            for (const element of result) {
                img = await chatroomsModel.ListImagesProduct(element.idpubliction);
                prefe = await chatroomsModel.ListPrefrencesProduct(element.idpubliction);
                //ItemOfer=await chatroomsModel.ListItemsOffers(element.idoffer)
                let Precio = Number.parseFloat(element.marketvalue).toFixed(4);

                let now = new Date();
                let servidor = date.format(now, 'DD/MM/YYYY');
                //let registro=element.registro;
                let registro = new Date(element.creacionSala);
                let regis = date.format(registro, 'DD/MM/YYYY');

                //console.log(now+" - "+registro);

                let comprobar_fecha = date.isSameDay(now, registro);
                // console.log(comprobar_fecha+" - ");
                // console.log("//////");
                let nuevo = false;
                if (registro == servidor) {
                    let nuevo = true;
                } else {
                    let nuevo = false;
                }
                arr.push({
                    "idSala": element.idSala,
                    "datecreated": regis,
                    "idPublicacion": element.idpubliction,
                    "typepublication": element.typepublication,
                    "namePublication": element.namePublication,
                    "valorComercial": Number.parseFloat(element.valorComercial).toFixed(4),
                    "Userpublication": element.iduserpublication,
                    "nameUserPublication": element.nameUserPublication,
                    "imgUserPublication": element.imgUserPublication,
                    "idoferta": element.idoffer,
                    "iduseroferta": element.iduseroffer,
                    "UserOferta": element.UserOferta,
                    "nameUserOferta": element.nameUserOferta,
                    "imgUserOferta": element.imgUserOferta,
                    "ProductImagesPublicacion": img.ImagesProduct,
                    "PreferencesPublicacion": prefe.Preferences
                    //"ItemOfer":ItemOfer

                });

            }
            resolve(arr)
        }
        catch (e) {
            console.log(e);
        }
    }
    )

}

//////////////////


chatroomsModel.ListPrefrencesProduct = (element) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT preference FROM `preferences_product` WHERE idproduct= ?', [element],
            (err2, result2) => {
                //console.log(element.id);   
                //console.log(element.namec);   
                //console.log(result2[1].preference);
                if (err2) {
                    resolve({
                        'error': err2
                    })
                } else {
                    // console.log(result2); 
                    // console.log(result2.length);
                    let preferences = [];
                    for (var atr2 in result2) {
                        preferences.push(result2[atr2].preference);
                    };
                    //console.log(preferences);
                    resolve({
                        "Preferences": preferences
                    });
                }

                //console.log(CatgySubCatg);
                //CatgySubCatg.Subcategory=result2;
                //console.log("//////SUBCATEGOR??A///////");
                // console.log(result2);

            })
    })
}



chatroomsModel.ListItemsOffers = (element, ValorPublication) => {
    return new Promise((resolve, reject) => {
        let SumItemsOffer = 0;
        let DiferenciaOffer = 0;
        let Afavor = false;
        let detalleProduct = {};
        pool.query(
            'SELECT ops.idoffers,ops.idpublication AS idproduct,ip.url,ops.status,p.name,p.marketvalue,p.datecreated AS datepublication,p.iduser,p.subcategory,p.name,p.details,p.typemoney,p.typepublication,p.status  FROM `offersproductservices` AS ops INNER JOIN product AS p ON ops.idpublication=p.id INNER JOIN imgproduct AS ip ON p.id=ip.idproduct WHERE idoffers=' + element,
            async (err2, result2) => {
                if (err2) {
                    console.log(err2);
                    resolve({
                        'error': err2
                    })
                } else {
                    //  console.log(result2); 
                    //  console.log(result2.length);
                    let ListItemsOffers = [];
                    let idItems = 0;
                    if (result2.length > 0) {
                        for (var atr2 in result2) {
                            // "iduser": result2[0].iduser,
                            if (idItems != result2[atr2].idproduct) {
                                ListItemsOffers.push({
                                    "idoffer": result2[atr2].id,
                                    "idpublication": result2[atr2].idproduct,
                                    "nameproduct": result2[atr2].name,
                                    "status": result2[atr2].status,
                                    "img": result2[atr2].url,
                                    "marketvalue": Number.parseFloat(result2[atr2].marketvalue).toFixed(4)
                                });

                                idItems = result2[atr2].idproduct;
                                SumItemsOffer = parseInt(SumItemsOffer) + parseInt(result2[atr2].marketvalue);
                            }

                        };
                        if (SumItemsOffer > ValorPublication) {
                            DiferenciaOffer = SumItemsOffer - ValorPublication;
                            Afavor = false;
                        } else {
                            DiferenciaOffer = ValorPublication - SumItemsOffer;
                            Afavor = true;
                        }

                    };
                    // console.log("result2");
                    console.log(result2);

                    //console.log(ListItemsOffers);
                    //detalleProduct = await ProductModel.armaresul(result2);  
                    console.log("detalleProduct");
                    // console.log(detalleProduct);
                    resolve({
                        "aFavor": Afavor,
                        "Valorferta": SumItemsOffer,
                        "DiferenciaOffer": DiferenciaOffer,
                        "itemsoffer": ListItemsOffers
                    });
                }

            })
    })
}


//CAMBIAR EL ESTADO DE UNA OFERTA- OFERTAS 
chatroomsModel.CloseChatRoom = (ChatRoomData) => {
    //let resultado = {};
    return new Promise((resolve, reject) => {
        if (pool) {
            //let FindDatOffer={};
            pool.query(
                'UPDATE  chatrooms SET  status= ? WHERE id= ?', [
                ChatRoomData.status,
                ChatRoomData.id
            ],
                async (err, result) => {
                    // console.log(result);
                    if (err) {
                        console.log(err);
                        resolve({
                            'error': err
                        })
                    } else {
                        //console.log(result);                       

                        resolve({
                            'result': result
                        })
                    }

                }
            )
            //return resultado;
        }
    })
};



//CAMBIAR ESTATUS SALA
// chatroomsModel.MatchOfferChatRoom = (ChatRoomData) => {
//     //let resultado = {};
//     return new Promise((resolve, reject) => {
//         if (pool) {
//             //let FindDatOffer={};
//             pool.query(
//                 'UPDATE  chatrooms SET  status= ? WHERE id= ?',[
//                     ChatRoomData.status,
//                     ChatRoomData.id
//                 ],
//                 async(err, result) => {
//                    // console.log(result);
//                     if (err) {
//                         resolve({
//                             'error': err
//                         })
//                     } else {                         

//                         resolve({
//                             'result': result
//                         })                        
//                     }

//                 }
//             )
//             //return resultado;
//         }
//     })
// };

// TAKASTEAR : 
// VERIFICAR QUE LOS DOS USUARIOS ESTEN DE ACUERO
// CAMBIAR DE ESTATUS A LA SALA - CERRARLA
// CAMBIAR DE ESTATUS LA PUBLICACI??N
//CAMBIAR DE ESTATUS LOS ITEMS DE LA OFERTA (LA PUBLICACIONES DE CONFORMAN LA OFERTA)
///DETERMINAR DE QUE USUARIO ES LA ACCI??N DEL MATCH 
chatroomsModel.MatchOfferChatRoom = (ChatRoomData, isUserPubli, confirMatch, MsgMatch, titulo, UserNotification, detalles) => {
    return new Promise((resolve, reject) => {
        if (pool)
            //let titulo="";

            pool.query(
                'SELECT * FROM chatrooms WHERE (iduseroffer="' + ChatRoomData.idUser + '" OR iduserpublication="' + ChatRoomData.idUser + '") AND id="' + ChatRoomData.id + '" AND STATUS=24',
                async (err, result) => {
                    //console.log(err);
                    console.log('SELECT * FROM chatrooms WHERE (iduseroffer="' + ChatRoomData.idUser + '" OR iduserpublication="' + ChatRoomData.idUser + '") AND id="' + ChatRoomData.id + '" AND STATUS=24');
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {
                        console.log(result);
                        let TypeNotification = 2;
                        let idrelation2 = result[0].idpubliction;
                        let idrelation = result[0].idproduct;
                        let idOferta = result[0].idoffer;
                        let offeru = result[0].iuserdoffer;
                        let publicationcoU = result[0].iduserpublication;

                        if (publicationcoU == ChatRoomData.idUser) {
                            isUserPubli = true;
                            pertenece = true;
                        }

                        if (offeru == ChatRoomData.idUser) {
                            isUserPubli = false;
                            pertenece = true;
                        }
                        //console.log(isUserPubli);

                        //ACTUALIZAMOS EL MATCH EN LA TABLA DE SALAS DE CHAT
                        let response = await chatroomsModel.UpdateMatchChatRoom(ChatRoomData, isUserPubli, confirMatch, MsgMatch);

                        let tokenPush = "";
                        let userNotification = "";
                        let iduserNoti = "";
                        let NameUser = "";
                        //DATOS DE LA PUBLICACI??N    
                        let idUserPublication = await Users.DataUserPublication(idrelation2);
                        let nameProducto = idUserPublication.result[0].nameProducto;
                        let UserPublication = idUserPublication.result[0].UserPublication;
                        let typepublication = idUserPublication.result[0].typepublication;


                        // VERIFICAR QUE LOS DOS USUARIOS ESTEN DE ACUERO - CONFIRMAR MATCH
                        if (isUserPubli == true) {
                            //VERIFICAMOS DE EL USUARIODE LA OFERTA TA HALLA HECHO UN MATCH O SI ESPERAMOS LA CONFIRMACI??N
                            if (result[0].matchoffer == true) {
                                //CONFIRMADO POR EL USUARIO DE LA OFERTA
                                confirMatch = true;
                            }

                            let idUserOferta = await Users.DataUserOferta(idOferta);
                            //console.log(idUserOferta.result[0]);
                            tokenPush = idUserOferta.result[0].tokenpush;
                            userNotification = idUserOferta.result[0].UserOferta;
                            NameUser = idUserOferta.result[0].NameUser;
                            iduserNoti = idUserOferta.result[0].UserOferta;

                        } else {
                            //VERIFICAMOS DE EL USUARIODE LA PUBLICACI??N TA HALLA HECHO UN MATCH O SI ESPERAMOS LA CONFIRMACI??N
                            if (result[0].matchpublication == true) {
                                //CONFIRMADO POR EL USUARIO DE LA PUBLICACI??N
                                confirMatch = true;
                            }


                            //console.log(idUserPublication.result[0]);
                            tokenPush = idUserPublication.result[0].tokenpush;
                            userNotification = idUserPublication.result[0].UserPublication;
                            NameUser = idUserPublication.result[0].NameUser;
                            iduserNoti = idUserPublication.result[0].UserPublication;
                        }

                        if (confirMatch == true) {
                            MsgMatch = "??TAKASTEO EXITOSO!";
                            // CAMBIAR DE ESTATUS LA PUBLICACI??N
                            let response2 = await ProductModel.UpdateStatusPublication2(result[0].idpubliction);
                            //CAMBIAR DE ESTATUS LAS PUBLICACIONES DE LA OFERTA - ITEMS
                            let response3 = await ProductModel.UpdateStatusPublicationOffer2(result[0].idoffer);
                            // CAMBIAR DE ESTATUS A LA SALA - CERRARLA  
                            let ChatRoomData = {
                                id: result[0].id,
                                status: 25
                            };
                            let response4 = await chatroomsModel.CloseChatRoom(ChatRoomData);
                            console.log(response4);

                            titulo = "??FELICIADES TIENES UN TAKASTEO!";

                            detalles = "En TAKAS, " + NameUser + " nos alegra el Takasteo del  producto <<" + nameProducto + ">>";

                        } else {
                            MsgMatch = "??ESPARAMOS LA CONFIRMACI??N DEL MATCH PARA TAKASTEAR!";

                            if (isUserPubli == true) {
                                titulo = "EST??S A UN PASO PARA TAKASTEO!";
                                detalles = NameUser + ", la publicaci??n  <<" + nameProducto + ">>, el producto que deseabas espera s??lo por ti para ser takasteado ";
                            } else {

                                titulo = "EST??S A UN PASO PARA TAKASTEO!";
                                detalles = NameUser + ", T?? publicaci??n <<" + nameProducto + ">> espera s??lo por ti para ser takasteado ";
                            }

                        }
                        ///CREAMOS Y ENVIAMOS TOTIFICACI??N///
                        // console.log("idUserPublication.tokenpush");
                        let idNotificacion = {};
                        if (typepublication == 1) {
                            let respCrearPush = await notificationModel.cearnotificacion(TypeNotification, idrelation2, userNotification, titulo, detalles, idOferta);
                            console.log(respCrearPush);
                            console.log(respCrearPush.result.insertId);
                            idNotificacion = respCrearPush.result.insertId;
                        } else {
                            idNotificacion = null;
                        }
                        //console.log(tokenPush);
                        ///////////////////////////////////////////

                        resolve({
                            'result': result[0],
                            'isUserPubli': isUserPubli,
                            'confirMatch': confirMatch,
                            'tokenPush': tokenPush,
                            'titulo': titulo,
                            'detalles': detalles,
                            'idNotificacion': idNotificacion,
                            'idOferta': idOferta,
                            'TypeNotification': TypeNotification,
                            'UserPublication': UserPublication,
                            'idrelation': idrelation,
                            'MsgMatch': MsgMatch
                        })

                    }

                }
            )
    }
    )


};

chatroomsModel.MatchOfferCR = (ChatRoomData, isUserPubli, confirMatch, MsgMatch, titulo, UserNotification, detalles) => {
    return new Promise((resolve, reject) => {
        if (pool)
            //let titulo="";

            pool.query(
                'SELECT * FROM chatrooms WHERE (iduseroffer="' + ChatRoomData.idUser + '" OR iduserpublication="' + ChatRoomData.idUser + '") AND id="' + ChatRoomData.id + '" AND STATUS=24',
                async (err, result) => {
                    //console.log(err);
                    console.log('SELECT * FROM chatrooms WHERE (iduseroffer="' + ChatRoomData.idUser + '" OR iduserpublication="' + ChatRoomData.idUser + '") AND id="' + ChatRoomData.id + '" AND STATUS=24');
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {
                        //if(result.length)
                        console.log("result.length");
                        console.log(result.length);
                        console.log("result.length");
                        console.log(result);
                        if (result.length != 0) {
                            let TypeNotification = 2;
                            let idrelation2 = result[0].idpubliction;
                            let idrelation = result[0].idproduct;
                            let idOferta = result[0].idoffer;
                            let offeru = result[0].iuserdoffer;
                            let publicationcoU = result[0].iduserpublication;

                            if (publicationcoU == ChatRoomData.idUser) {
                                isUserPubli = true;
                                pertenece = true;
                            }

                            if (offeru == ChatRoomData.idUser) {
                                isUserPubli = false;
                                pertenece = true;
                            }
                            //console.log(isUserPubli);

                            //ACTUALIZAMOS EL MATCH EN LA TABLA DE SALAS DE CHAT
                            let response = await chatroomsModel.UpdateMatchChatRoom(ChatRoomData, isUserPubli, confirMatch, MsgMatch);

                            let tokenPush = "";
                            let userNotification = "";
                            let iduserNoti = "";
                            let NameUser = "";
                            //DATOS DE LA PUBLICACI??N    
                            let idUserPublication = await Users.DataUserPublication(idrelation2);
                            let nameProducto = idUserPublication.result[0].nameProducto;
                            let UserPublication = idUserPublication.result[0].UserPublication;
                            let typepublication = idUserPublication.result[0].typepublication;


                            let idUserOferta = await Users.DataUserOferta(idOferta);
                            //console.log(idUserOferta.result[0]);
                            tokenPush = idUserOferta.result[0].tokenpush;
                            userNotification = idUserOferta.result[0].UserOferta;
                            NameUser = idUserOferta.result[0].NameUser;
                            iduserNoti = idUserOferta.result[0].UserOferta;


                            confirMatch = ChatRoomData.match
                            console.log("ChatRoomData.match");
                            console.log(ChatRoomData.match);
                            console.log("ChatRoomData.match");

                            if (ChatRoomData.match == true) {
                                MsgMatch = "??TAKASTEO EXITOSO!";
                                // CAMBIAR DE ESTATUS LA PUBLICACI??N
                                let response2 = await ProductModel.UpdateStatusPublication2(result[0].idpubliction);
                                //CAMBIAR DE ESTATUS LAS PUBLICACIONES DE LA OFERTA - ITEMS
                                let response3 = await ProductModel.UpdateStatusPublicationOffer2(result[0].idoffer);
                                // CAMBIAR DE ESTATUS A LA SALA - CERRARLA  
                                let ChatRoomData = {
                                    id: result[0].id,
                                    status: 25
                                };
                                let response4 = await chatroomsModel.CloseChatRoom(ChatRoomData);
                                console.log(response4);

                                titulo = "??FELICIADES TIENES UN TAKASTEO!";

                                detalles = "En TAKAS, " + NameUser + " nos alegra el Takasteo del  producto <<" + nameProducto + ">>";

                            } else {
                                MsgMatch = "??Uff estuviste a punto de TAKASTEAR!";

                                titulo = "HAZ RECHAZADO LA OFERTA!";
                                detalles = NameUser + ", has rechazado la publicaci??n  <<" + nameProducto + ">>";


                            }
                            ///CREAMOS Y ENVIAMOS TOTIFICACI??N///
                            // console.log("idUserPublication.tokenpush");
                            let idNotificacion = {};
                            if (typepublication == 1) {
                                let respCrearPush = await notificationModel.cearnotificacion(TypeNotification, idrelation2, userNotification, titulo, detalles, idOferta);
                                console.log(respCrearPush);
                                console.log(respCrearPush.result.insertId);
                                idNotificacion = respCrearPush.result.insertId;
                            } else {
                                idNotificacion = null;
                            }
                            //console.log(tokenPush);
                            ///////////////////////////////////////////

                            resolve({
                                'result': result[0],
                                'isUserPubli': isUserPubli,
                                'confirMatch': confirMatch,
                                'tokenPush': tokenPush,
                                'titulo': titulo,
                                'detalles': detalles,
                                //'idNotificacion': idNotificacion,
                                'idOferta': idOferta,
                                'TypeNotification': TypeNotification,
                                'UserPublication': UserPublication,
                                'idrelation': idrelation,
                                'MsgMatch': MsgMatch
                            })
                        }else {
                            resolve({
                                'result': 0,
                                'isUserPubli': 0,
                                'confirMatch': 0,
                                'tokenPush': 0,
                                'titulo': 0,
                                'detalles': 0,
                                'idNotificacion': 0,
                                'idOferta': 0,
                                'TypeNotification': 0,
                                'UserPublication': 0,
                                'idrelation': 0,
                                'MsgMatch': "Publicaci??n no encontrada"
                            })
                        }

                    }

                }
            )
    }
    )


};

chatroomsModel.MatchOfferCRsbtk = (ChatRoomData, isUserPubli, confirMatch, MsgMatch, titulo, UserNotification, detalles) => {
    return new Promise((resolve, reject) => {
        if (pool)
            //let titulo="";

            pool.query(
                'SELECT * FROM chatrooms WHERE (iduseroffer="' + ChatRoomData.idUser + '" OR iduserpublication="' + ChatRoomData.idUser + '") AND id="' + ChatRoomData.id + '" AND STATUS=24',
                async (err, result) => {
                    //console.log(err);
                    console.log('SELECT * FROM chatrooms WHERE (iduseroffer="' + ChatRoomData.idUser + '" OR iduserpublication="' + ChatRoomData.idUser + '") AND id="' + ChatRoomData.id + '" AND STATUS=24');
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {
                        console.log("result.length");
                        console.log(result.length);
                        console.log("result.length");
                        console.log(result);
                        if (result.length != 0) {
                            let TypeNotification = 2;
                            let idrelation2 = result[0].idpubliction;
                            let idrelation = result[0].idproduct;
                            let idOferta = result[0].idoffer;
                            let offeru = result[0].iuserdoffer;
                            let publicationcoU = result[0].iduserpublication;

                            if (publicationcoU == ChatRoomData.idUser) {
                                isUserPubli = true;
                                pertenece = true;
                            }

                            if (offeru == ChatRoomData.idUser) {
                                isUserPubli = false;
                                pertenece = true;
                            }
                            //console.log(isUserPubli);

                            //ACTUALIZAMOS EL MATCH EN LA TABLA DE SALAS DE CHAT
                            let response = await chatroomsModel.UpdateMatchChatRoom(ChatRoomData, isUserPubli, confirMatch, MsgMatch);

                            let tokenPush = "";
                            let userNotification = "";
                            let iduserNoti = "";
                            let NameUser = "";
                            //DATOS DE LA PUBLICACI??N    
                            let idUserPublication = await Users.DataUserPublication(idrelation2);
                            let nameProducto = idUserPublication.result[0].nameProducto;
                            let UserPublication = idUserPublication.result[0].UserPublication;
                            let typepublication = idUserPublication.result[0].typepublication;


                            let idUserOferta = await Users.DataUserOferta(idOferta);
                            //console.log(idUserOferta.result[0]);
                            tokenPush = idUserOferta.result[0].tokenpush;
                            userNotification = idUserOferta.result[0].UserOferta;
                            NameUser = idUserOferta.result[0].NameUser;
                            iduserNoti = idUserOferta.result[0].UserOferta;


                            confirMatch = ChatRoomData.match
                            console.log("ChatRoomData.match");
                            console.log(ChatRoomData.match);
                            console.log("ChatRoomData.match");

                            if (ChatRoomData.match == true) {
                                MsgMatch = "??SUBASTAKASTEO EXITOSO!";
                                // CAMBIAR DE ESTATUS LA PUBLICACI??N
                                let response2 = await ProductModel.UpdateStatusPublication2(result[0].idpubliction);
                                //CAMBIAR DE ESTATUS LAS PUBLICACIONES DE LA OFERTA - ITEMS
                                let response3 = await ProductModel.UpdateStatusPublicationOffer2(result[0].idoffer);
                                // CAMBIAR DE ESTATUS A LA SALA - CERRARLA  
                                let ChatRoomData = {
                                    id: result[0].id,
                                    status: 25
                                };
                                let response4 = await chatroomsModel.CloseChatRoom(ChatRoomData);
                                console.log(response4);

                                titulo = "??FELICIADES TIENES UN SUBASTAKASTEO!";

                                detalles = "En TAKAS, " + NameUser + " nos alegra el Subaskateo del  producto <<" + nameProducto + ">>";

                            } else {
                                MsgMatch = "??Uff estuviste a punto de TAKASTEAR!";

                                titulo = "HAZ RECHAZADO LA OFERTA!";
                                detalles = NameUser + ", has rechazado la publicaci??n  <<" + nameProducto + ">>";


                            }
                            ///CREAMOS Y ENVIAMOS TOTIFICACI??N///
                            // console.log("idUserPublication.tokenpush");
                            let idNotificacion = {};
                            if (typepublication == 1) {
                                let respCrearPush = await notificationModel.cearnotificacion(TypeNotification, idrelation2, userNotification, titulo, detalles, idOferta);
                                console.log(respCrearPush);
                                console.log(respCrearPush.result.insertId);
                                idNotificacion = respCrearPush.result.insertId;
                            } else {
                                idNotificacion = null;
                            }
                            //console.log(tokenPush);
                            ///////////////////////////////////////////

                            resolve({
                                'result': result[0],
                                'isUserPubli': isUserPubli,
                                'confirMatch': confirMatch,
                                'tokenPush': tokenPush,
                                'titulo': titulo,
                                'detalles': detalles,
                                //'idNotificacion': idNotificacion,
                                'idOferta': idOferta,
                                'TypeNotification': TypeNotification,
                                'UserPublication': UserPublication,
                                'idrelation': idrelation,
                                'MsgMatch': MsgMatch
                            })
                        }
                        else {
                            resolve({
                                'result': 0,
                                'isUserPubli': 0,
                                'confirMatch': 0,
                                'tokenPush': 0,
                                'titulo': 0,
                                'detalles': 0,
                                'idNotificacion': 0,
                                'idOferta': 0,
                                'TypeNotification': 0,
                                'UserPublication': 0,
                                'idrelation': 0,
                                'MsgMatch': "Publicaci??n no encontrada"
                            })
                        }

                    }

                }
            )
    }
    )


};



//ACTUALIZAMOS EL MATCH EN LA TABLA DE SALAS DE CHAT
chatroomsModel.UpdateMatchChatRoom = (ChatRoomData, isUserPubli) => {
    //let resultado = {};
    return new Promise((resolve, reject) => {
        if (pool) {
            //let FindDatOffer={};
            let consulta = "";
            if (isUserPubli == true) {
                consulta = "UPDATE  chatrooms SET status=25, matchpublication=? WHERE id= ?";
            } else {
                consulta = "UPDATE  chatrooms SET  status=25, matchoffer=? WHERE id= ?";
            }
            pool.query(
                consulta, [
                ChatRoomData.match,
                ChatRoomData.id
            ],
                async (err, result) => {
                    // console.log(result);
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {

                        resolve({
                            'result': result
                        })
                    }

                }
            )
            //return resultado;
        }
    })
};

//ACTUALIZAMOS STATUS DE LA PUBLICACI??N
ProductModel.UpdateStatusPublication2 = (idPubli) => {
    //let resultado = {};
    return new Promise((resolve, reject) => {
        if (pool) {
            //let FindDatOffer={};
            console.log("idPubli - UpdateStatusPublication2");
            console.log(idPubli);
            console.log("idPubli -UpdateStatusPublication2");
            let consulta = "UPDATE  product SET  status=4 WHERE id=" + idPubli;

            pool.query(
                consulta,
                async (err, result) => {
                    //console.log(result);
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {

                        resolve({
                            'result': result
                        })
                    }

                }
            )
            //return resultado;
        }
    })
};


//ACTUALIZAMOS STATUS DE LAS PUBLICACIONES DE UNA OFERTA
ProductModel.UpdateStatusPublicationOffer2 = (idOffer) => {
    //let resultado = {};
    return new Promise((resolve, reject) => {
        if (pool) {
            //let FindDatOffer={};
            let consulta = "SELECT o.id, ops.idpublication FROM offers AS o  INNER JOIN offersproductservices AS ops ON o.id=ops.idoffers WHERE o.id=" + idOffer;

            pool.query(
                consulta,
                async (err, result) => {
                    //console.log(result);
                    if (err) {
                        resolve({
                            'error': err
                        })
                    } else {
                        ///DETERMINAR DE QUE USUARIO ES LA ACCI??N DEL MATCH 
                        let response = await ProductModel.RecorridoPublicationOffer2(result);

                        resolve({
                            'result': result
                        })
                    }

                }
            )
            //return resultado;
        }
    })
};

//UPDATE ITEMS DE PUBLICACIONES QUE PERTENECEN A UNA OFERTA 
ProductModel.RecorridoPublicationOffer2 = async (element) => {

    if (element.length > 0) {
        // console.log(SumItemsOffer);
        for (var atr2 in element) {
            // "iduser": element[0].iduser,
            let response = await ProductModel.UpdateStatusPublication2(element[atr2].idpublication);

        }; // fin for                    
    }; //fin if

};

module.exports = chatroomsModel;
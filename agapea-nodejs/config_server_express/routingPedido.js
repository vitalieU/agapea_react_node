const express=require('express');
const router=express.Router();

const jsonwebtoken=require('jsonwebtoken');

const pedidoController=require('../controllers/pedidoController');

//-------------- funcion middleware check JWT mandado por cliente react -----------------
async function checkJWT(req,res,next){
    try {
        //extraigo de la peticion, la cabecera "Authorization: Bearer ....jwt..."
        let _jwt=req.headers.authorization.split(' ')[1];
        console.log('JWT en cabecera mandado por cliente react...', _jwt);

        const _payload=await jsonwebtoken.verify(_jwt, process.env.JWT_SECRETKEY);
        req.payload=_payload;
        next();

    } catch (error) {
        console.log('error al intentar comprobar el JWT enviado desde el cliente react...', error);
        res.status(401)
            .send(
                 { 
                    codigo:1,
                    mensaje:'error al intentar comprobar el JWT enviado',
                    error:error.mensaje,
                    otrosdatos:null,
                    datoscliente:null,
                    jwt:null
                }
            );
    }
}

router.post('/FinalizaPedido', checkJWT, pedidoController.finalizarPedido);
router.get('/PayPalCallback', pedidoController.paypalCallBack);

module.exports=router;
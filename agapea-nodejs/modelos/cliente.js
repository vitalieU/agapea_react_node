//modulo de codigo para crearnos un schema mongoose para los datos a registrar de un cliente
//un esquema mongoose sirve para construir objetos q se van a mapear contra documentos de una determinada coleccion 

// esquema ------> objetos <======> documento coleccion bd-mongodb

//en estos esquemas puedo meter reglas de validacion, puedes definir metodos estaticos, metodos de instancia
const mongoose=require('mongoose');

var clienteSchema=new mongoose.Schema(
    {
        nombre: { type: String, required:[true,'* Nombre obligatario'], maxLength:[50, '* Maxima long.en nobre de 50 caract.'] },
        apellidos: { type: String, required:[true,'* Apellidos obligatarios'], maxLength:[200, '* Maxima long.en apellidos de 200 caract.'] },
        cuenta: {
                    email: { type: String, required:[true, '* Email obligatorio'], match:[ new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\.\\w{2,3})+$'), '* formato incorrecto del email'] },
                    password:{ type:String, required: [true,'* Password oblitaoria'], match:[ /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])\S{8,}$/, '* En la password al menos una MAYS, MINS, NUMERO y caracter raro'] }, 
                    cuentaActiva:{ type:Boolean, required:true, default: false },
                    login:{ type: String, maxLength:[ 200, '* max.longitud del email 200 cars.'] }, 
                    imagenAvatarBASE64:{type: String, default:'' }
                 },
        telefono:{ type: String, required: [true,'* Telefono obligatorio'], match: [ /^\d{3}(\s?\d{2}){3}$/, '*El telefono tiene q tener formato 666 11 22 33'] },
        fechaNacimiento:{ type: String, required: false },
        genero:{ type: String, required: false, enum:['Hombre','Mujer','Otro'] },
        descripcion:{ type: String, required: false },
        direcciones:[
            { type: mongoose.Schema.Types.ObjectId, ref:'Direccion'}
        ],
        pedidos:[
            { type: mongoose.Schema.Types.ObjectId, ref:'Pedido'}
        ],
        listas:[
            { type: mongoose.Schema.Types.ObjectId, ref:'Lista'}
        ],
    }
)

module.exports=mongoose.model('Cliente',clienteSchema,'clientes');
//1º argumento es el nombre de los objetos q se van a crear a partir de este esquema, objetos 'Cliente'
//2º argumento el esquema q se usa como prototipo para crearlos
//3º argumento el nombre de la coleccion en la BD de mongoDB con la q se mapean estos objetos
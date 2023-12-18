//modulo de nodejs donde exporto objeto javascript puro q tiene como propiedades las funciones middleware
//q necesita el objeto router express de zona cliente....

const bcrypt = require("bcrypt"); //<----- paquete para cifrar y comprobar hashes de passswords
const jsonwebtoken = require("jsonwebtoken"); // <---- paquete para generar JWT o tokens de sesion para cada cliente....
const multer = require("multer"); //<---- paquete para subir ficheros al servidor express

const Cliente = require("../modelos/cliente");
const Categoria = require("../modelos/categoria");
const Direccion = require("../modelos/direccion");
const Pedido = require("../modelos/pedido");
const Libro = require("../modelos/libro");
const Valoracion = require("../modelos/valoracion");
const Lista=require('../modelos/lista');


module.exports = {
  login: async (req, res, next) => {
    try {
      //en req.body esta el objeto q me manda el componente Login.js de REACT... { email:'...', password: '....' }
      let { email, password } = req.body;

      //1º comprobar q existe un cliente con el email q me mandan en coleccion clientes de Mongodb
      let _cliente = await Cliente.findOne({ "cuenta.email": email }).populate([
        { path: "direcciones", model: "Direccion" },
        {
          path: "pedidos",
          model: "Pedido",
          populate: [{ path: "elementosPedido.libroElemento", model: "Libro" }],
        },
        {
          path: "listas",
          model: "Lista",
          populate: [
            {
              path: "Libros",
              model: "Libro",
            },
          ]
        }
      ]);
      if (!_cliente) throw new Error("no existe una cuenta con ese email....");

      //2º comprobar q el hash de la password concuerda con la password q me mandan y su hash
      if (bcrypt.compareSync(password, _cliente.cuenta.password)) {
        //3º comprobar q la cuenta esta ACTIVADA...
        if (!_cliente.cuenta.cuentaActiva)
          throw new Error("debes activar tu cuenta....comprueba el email"); //<----deberiamos reenviar email de activacion...

        //4º si todo ok... devolver datos del cliente con pedidos y direcciones expandidos (no los _id)
        //                 devolver token de sesion JWT
        let _jwt = jsonwebtoken.sign(
          {
            nombre: _cliente.nombre,
            apellidos: _cliente.apellidos,
            email: _cliente.cuenta.email,
            idcliente: _cliente._id,
          }, //<--- payload jwt
          process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
          { expiresIn: "1h", issuer: "http://localhost:3003" } //opciones o lista de cliams predefinidos
        );

        res.status(200).send({
          codigo: 0,
          mensaje: "login OKS...",
          error: "",
          datoscliente: _cliente,
          tokensesion: _jwt,
          otrosdatos: null,
        });
      } else {
        throw new Error("password incorrecta....");
      }
    } catch (error) {
      console.log("error en el login....", error);
      res.status(200).send({
        codigo: 1,
        mensaje: "login fallido",
        error: error.message,
        datoscliente: null,
        tokensesion: null,
        otrosdatos: null,
      });
    }
  },
  registro: async (req, res, next) => {
    try {
      console.log(
        "datos recibidos por el cliente react en componente registro, por ajax...",
        req.body
      );

      //1º paso:con los datos mandados por el componente de react, tenemos que insertarlos en la coleccion clientes de la bd de mongo
      var __resultInsertCliente = await new Cliente({
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        cuenta: {
          email: req.body.email,
          login: req.body.login,
          password: bcrypt.hashSync(req.body.password, 10),
          cuentaActiva: false,
          imagenAvatarBASE64: "",
        },
      }).save();

      console.log(
        "resultado del insert en la coleccion clientes de mongodb...",
        __resultInsertCliente
      );

      //2º paso: mandar email de activacion con mailjet (instalar paquete node-mailjet) --------------

      //3º paso: mandar respuesta----------------------------------------------------------------------
      res.status(200).send({
        codigo: 0,
        mensaje: "datos del cliente insertados ok",
      });
    } catch (error) {
      console.log("error al hacer el insert en coleccion clientes...", error);
      res.status(200).send({
        codigo: 1,
        mensaje: `error a la hora de insertar datos del cliente: ${JSON.stringify(
          error
        )}`,
      });
    }
  },
  obtenerDatosCliente: async (req, res, next) => {
    try {
      console.log("payload en el jwt de un solo uso...", req.payload);
      console.log(
        "datos mandados en el body por el servicio de react restClienteService...",
        req.body
      );

      let { idcliente, idpedido, idpago } = req.payload;
      let _idcliente = req.body.idcliente;

      if (_idcliente !== idcliente) {
        throw new Error(
          "alguien ha manipulado los datos mandados en el body de la pet.post, no coincide con lo almacenado en el JWT...ojito"
        );
      } else {
        let _cliente = await Cliente.findById(idcliente).populate([
          { path: "direcciones", model: "Direccion" },
          {
            path: "pedidos",
            model: "Pedido",
            populate: [
              { path: "elementosPedido.libroElemento", model: "Libro" },
            ],
          },
          {
            path: "listas",
            model: "Lista",
            populate: [
              {
                path: "Libros",
                model: "Libro",
              },
            ]
          }
        ]);

        //token de sesion para datos del cliente actualizados....
        let _jwt = jsonwebtoken.sign(
          {
            nombre: _cliente.nombre,
            apellidos: _cliente.apellidos,
            email: _cliente.cuenta.email,
            idcliente: _cliente._id,
          }, //<--- payload jwt
          process.env.JWT_SECRETKEY, //<---- clave secreta para firmar jwt y comprobar autenticidad...
          { expiresIn: "1h", issuer: "http://localhost:3003" } //opciones o lista de cliams predefinidos
        );

        res.status(200).send({
          codigo: 0,
          mensaje:
            "datos cliente recuperados ok con nuevo pedido metido y nuevo JWT de sesion creado",
          error: null,
          datoscliente: _cliente,
          tokensesion: _jwt,
          otrosdatos: null,
        });
      }
    } catch (error) {
      console.log("error al obtener datos cliente...", error);
      res.status(401).send({
        codigo: 1,
        mensaje:
          "error al obtener datos cliente y generar nuevo JWT de sesion tras pago con paypal...",
        error: error.message,
        datoscliente: null,
        tokensesion: null,
        otrosdatos: null,
      });
    }
  },
  obtenerAvatar: async (req, res, next) => {
    try {
      let _idcliente = req.payload.idcliente;

      let _cliente = await Cliente.findById(_idcliente);

      res
        .status(200)
        .send({ codigo: 0, img: _cliente.cuenta.imagenAvatarBASE64 });
    } catch (error) {
      console.log("error al recuperar imagen de avatar del cliente...", error);
      res.status(401).send({ codigo: 1, img: null });
    }
  },

  actualizarAvatar: async (req, res, next) => {
    try {
      console.log(
        "datos recibidos en el body de la peticion patch de actualizar avatar...",
        req.payload,
        req.body
      );
      let _idcliente = req.payload.idcliente;

      let _cliente = await Cliente.findById(_idcliente);
      console.log("cliente encontrado en bd...", _cliente);

      _cliente.cuenta.imagenAvatarBASE64 = req.body.avatar;
      let _resultUpdate = await _cliente.save();

      res.status(200).send(_resultUpdate);
    } catch (error) {
      console.log("error al actualizar imagen de avatar del cliente...", error);
      res.status(401).send();
    }
  },
  actualizarDatosCliente: async (req, res, next) => {
    try {
      let _idcliente = req.payload.idcliente;
      let _cliente = await Cliente.findById(_idcliente);

      _cliente.nombre = req.body.datoscliente.nombre;
      _cliente.apellidos = req.body.datoscliente.apellidos;
      _cliente.telefono = req.body.datoscliente.telefono;
      _cliente.cuenta.email = req.body.datoscliente.email;
      _cliente.cuenta.login = req.body.datoscliente.usuario;
      _cliente.cuenta.password = bcrypt.hashSync(
        req.body.datoscliente.password,
        10
      );
      _cliente.fechaNacimiento = req.body.datoscliente.fechaNacimiento;
      _cliente.genero = req.body.datoscliente.genero;
      _cliente.descripcion = req.body.datoscliente.descripcion;
      let _resultUpdate = await _cliente.save();

      if (_resultUpdate) {
        let _jwt = jsonwebtoken.sign(
          {
            nombre: _cliente.nombre,
            apellidos: _cliente.apellidos,
            email: _cliente.cuenta.email,
            idcliente: _cliente._id,
          },
          process.env.JWT_SECRETKEY,
          { expiresIn: "1h", issuer: "http://localhost:3003" }
        );

        res.status(200).send({
          codigo: 0,
          mensaje: "Update hecho correctamente...",
          error: "",
          datoscliente: _cliente,
          tokensesion: _jwt,
          otrosdatos: null,
        });
      }
    } catch (error) {
      console.log("error al actualizar datos del cliente...", error);
      res.status(401).send({
        codigo: 1,
        mensaje: "error al actualizar datos del cliente...",
        error: error.message,
        datoscliente: null,
        tokensesion: null,
        otrosdatos: null,
      });
    }
  },
  borrarDireccionCliente: async (req, res, next) => {
    try {
      let _idcliente = req.payload.idcliente;
      let _iddireccion = req.params.iddireccion;

      let _cliente = await Cliente.findById(_idcliente);
      if (_cliente._id.toString() !== _idcliente)
        throw new Error(
          "alguien ha manipulado el idcliente en el jwt de un solo uso..."
        );

      let _resultDelete = await Direccion.findByIdAndDelete(_iddireccion);
      _cliente.direcciones.pull(_iddireccion);
      await _cliente.save();

      res.status(200).send(_resultDelete);
    } catch (error) {
      console.log("error al borrar direccion del cliente...", error);
      res.status(401).send();
    }
  },
  actualizarDireccionCliente: async (req, res, next) => {
    console.log("datos recibidos en el body de la peticion patch de actualizar direccion cliente...", req.payload, req.body)
    try {
      let _idcliente =req.payload.idcliente;
      let _cliente = await Cliente.findById(_idcliente);

      let _iddireccion = req.body.direccion._id;
      let _direccion = await Direccion.findById(_iddireccion);
      console.log(req.body);
      let _resultUpdate = null;
      if (_cliente.direcciones.includes(_iddireccion)) {
        _direccion.calle = req.body.direccion.calle;
        _direccion.cp = req.body.direccion.cp;
        _direccion.pais = req.body.direccion.pais;
        _direccion.provincia.CPRO = req.body.direccion.provincia.CPRO;
        _direccion.provincia.CCOM = req.body.direccion.provincia.CCOM;
        _direccion.provincia.PRO = req.body.direccion.provincia.PRO;
        _direccion.municipio.CPRO = req.body.direccion.municipio.CPRO;
        _direccion.municipio.CMUM = req.body.direccion.municipio.CMUM;
        _direccion.municipio.DMUN50 = req.body.direccion.municipio.DMUN50;
        _direccion.municipio.CUN = req.body.direccion.municipio.CUN;
        _direccion.esPrincipal = req.body.direccion.esPrincipal;
        _direccion.esFacturacion = req.body.direccion.esFacturacion;

        _resultUpdate = await _direccion.save();
      } else {
        _direccion = await new Direccion({
          calle: req.body.direccion.calle,
          cp: req.body.direccion.cp,
          pais: req.body.direccion.pais,
          provincia: {
            CPRO: req.body.direccion.provincia.CPRO,
            CCOM: req.body.direccion.provincia.CCOM,
            PRO: req.body.direccion.provincia.PRO,
          },
          municipio: {
            CPRO: req.body.direccion.municipio.CPRO,
            CMUM: req.body.direccion.municipio.CMUM,
            DMUN50: req.body.direccion.municipio.DMUN50,
            CUN: req.body.direccion.municipio.CUN,
          },
          esPrincipal: req.body.direccion.esPrincipal,
          esFacturacion: req.body.direccion.esFacturacion,
        }).save();
        _cliente.direcciones.push(_direccion._id);
        _resultUpdate = await _cliente.save();

        return res.status(200).send(_resultUpdate);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({ error });
    }
  },
  obtenerValoraciones: async (req, res, next) => {
    console.log("payload en el jwt de un solo uso...", req.payload)
    
    try {
      let id=req.payload.idcliente;
      let _cliente = await Cliente.findById(id);

      let _valoraciones = await Valoracion.find({ username: _cliente.cuenta.login }).populate({model:'Libro',path:'IdLibro'});
      console.log(_valoraciones)
      if(_valoraciones.length===0) throw new Error('No hay valoraciones')
      else return res.status(200).send({_valoraciones});

    } catch (error) {
      res.status(401).send({ mensaje: error.message });
    }
  },
  modificarValoraciones: async (req, res, next) => {
    try {
      const { id, valoracion,comentario } = req.body;
      const idcliente = req.payload.idcliente;
      const _valoracion=await Valoracion.findById(id);
      const _cliente=await Cliente.findById(idcliente);
      if(_valoracion.username!==_cliente.cuenta.login) throw new Error('No tienes permisos para modificar esta valoración');
      _valoracion.valoracion=valoracion;
      _valoracion.comentario=comentario;
      await _valoracion.save();
      if(_valoracion) return res.status(200).send({codigo:0,mensaje:'Valoración modificada correctamente'});
    } catch (error) {
      res.status(401).send({ 
        codigo: 1,
        mensaje: error.message,

      });
    }
  },
  añadirValoracion: async (req, res, next) => {
    try {
      const { isbn13, valoracion } = req.body;
      const idcliente = req.payload.idcliente;
      const _cliente=await Cliente.findById(idcliente);
      const _libro=await Libro.findOne({ISBN13:isbn13});
      const _valoracion = await new Valoracion({
        IdLibro:_libro._id,
        username:_cliente.cuenta.login,
        valoracion:valoracion,
        comentario:'',
        fecha:Date.now()
      }).save();
      res.status(200).send({codigo:0,mensaje:'Valoración añadida correctamente',idValoracion:_valoracion._id});
      
    } catch (error) {
      res.status(401).send({codigo:1,mensaje:error.message});
    }
  },
  añadirComentario: async (req, res, next) => {
    try {
      const { idValoracion, comentario } = req.body;
      const idcliente = req.payload.idcliente;
      const _cliente=await Cliente.findById(idcliente);
      const _valoracion=await Valoracion.findById(idValoracion);
      if(_valoracion.username!==_cliente.cuenta.login) throw new Error('No tienes permisos para modificar esta valoración');
      _valoracion.comentario=comentario;
      await _valoracion.save();
      if(_valoracion) return res.status(200).send({codigo:0,mensaje:'Comentario añadido correctamente'});
    } catch (error) {
      res.status(401).send({codigo:1,mensaje:error.message});
    }
  },
  borrarValoracion: async (req, res, next) => {
    try {
      const { id } = req.body;
      const idcliente = req.payload.idcliente;
      const _cliente=await Cliente.findById(idcliente);
      const _valoracion=await Valoracion.findById(id);
      if(_valoracion.username!==_cliente.cuenta.login) throw new Error('No tienes permisos para modificar esta valoración');
      await Valoracion.findByIdAndDelete(id);
      res.status(200).send({codigo:0,mensaje:'Valoración eliminada correctamente'});
      
    } catch (error) {
      res.status(401).send({codigo:1,mensaje:error.message});
    }
  },
  crearLista: async (req, res, next) => {
    try {
      const { nombre,descripcion } = req.body;
      const idcliente = req.payload.idcliente;
      const _cliente=await Cliente.findById(idcliente);
      const _lista=await new Lista({
        Nombre:nombre,
        Descripcion:descripcion,
        Libros:[]
      }).save();
      _cliente.listas.push(_lista._id);
      await _cliente.save();
      res.status(200).send({codigo:0,mensaje:'Lista creada correctamente',listaAniadida:_lista});
    } catch (error) {
      res.status(401).send({codigo:1,mensaje:error.message});
    }
  },
  aniadirLibroLista: async (req, res, next) => {
    try {
      const { idLista, idLibro } = req.body;
      const idcliente = req.payload.idcliente;
      const _cliente=await Cliente.findById(idcliente);
      const _lista=await Lista.findById(idLista);
      _lista.Libros.push(idLibro);
      await _lista.save();
      res.status(200).send({codigo:0,mensaje:'Libro añadido correctamente'});
    } catch (error) {
      res.status(401).send({codigo:1,mensaje:error.message});
    }
  },
  aniadirLibroNewLista: async (req, res, next) => {
    try {
      const { nombreLista,descripcion,idLibro } = req.body;
      const idcliente = req.payload.idcliente;
      const _cliente=await Cliente.findById(idcliente);
      const _lista=await new Lista({
        Nombre:nombreLista,
        Descripcion:descripcion,
        Libros:[idLibro]
      }).save();
      _cliente.listas.push(_lista._id);
      await _cliente.save();
      res.status(200).send({codigo:0,mensaje:'Libro añadido correctamente a la lista creada',listaAniadida:_lista});
    } catch (error) {
      res.status(401).send({codigo:1,mensaje:error.message});
    }
  },
  borrarLibroLista: async (req, res, next) => {
    try {
      const { idLista, idLibro } = req.body;
      const idcliente = req.payload.idcliente;
      const _cliente=await Cliente.findById(idcliente);
      const _lista=await Lista.findById(idLista);
      _lista.Libros.pull(idLibro);
      await _lista.save();
      res.status(200).send({codigo:0,mensaje:'Libro eliminado correctamente'});
    } catch (error) {
      res.status(401).send({codigo:1,mensaje:error.message});
    }
  },
  borrarLista: async (req, res, next) => {
    try {
      const { idLista } = req.body;
      const idcliente = req.payload.idcliente;
      const _cliente=await Cliente.findById(idcliente);
      _cliente.listas.pull(idLista);
      const resp=await _cliente.save();
      const resp2= await Lista.findByIdAndDelete(idLista);

      if(resp && resp2) return
        res.status(200).send({codigo:0,mensaje:'Lista eliminada correctamente'});
    } catch (error) {
      res.status(401).send({codigo:1,mensaje:error.message});
    }
  }
};

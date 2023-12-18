import ModalDirecciones from "./ModalDirecciones";
import Opinion from "./Opinion";
import { useEffect, useState } from "react";
import { useClienteLoggedContext } from "../../../context-providers/clienteLoggedContext";
import clienteRESTService from "../../../servicios/restCliente";

function InicioPanel() {
  //#region --------------- state manejado por el componente (global por context-api o local) ------------------
  let { clienteLogged, dispatch } = useClienteLoggedContext();
  const [avatarCliente, setAvatarCliente] = useState(null);
  const [FormData, setFormData] = useState({
    email: "",
    password: "",
    reppass: "",
    nombre: "",
    apellidos: "",
    telefono: "",
    usuario: "",
    genero: "",
    dia: "",
    mes: "",
    anio: "",
    descripcion: "",
  });
  const [direcciones, setDirecciones] = useState([]);
  const [direccion, setDireccion] = useState(null);
  const [opiniones, setOpiniones] = useState([]);

  let days = [];
  for (let i = 1; i <= 30; i++) {
    days.push(i.toString().padStart(2, "0"));
  }
  const months = [...Array(12).keys()].map((i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  //#endregion

  //#region --------------- efectos del componente -------------------------------------------------------------

  useEffect(() => {
    function actualizarStaateFormData() {
      //poner el vlaue de todos los impts del form
      document.getElementById("inputEmail").value =
        clienteLogged.datoscliente.cuenta.email;
      document.getElementById("inputNombre").value =
        clienteLogged.datoscliente.nombre;
      document.getElementById("inputApellidos").value =
        clienteLogged.datoscliente.apellidos;
      document.getElementById("inputTlfn").value =
        clienteLogged.datoscliente.telefono;
      document.getElementById("inputUsuario").value =
        clienteLogged.datoscliente.cuenta.login;
      document.getElementById("genero").value =
        clienteLogged.datoscliente.genero;
      document.getElementById("dia").value =
        clienteLogged.datoscliente.fechaNacimiento.substring(0, 2);
      document.getElementById("mes").value =
        clienteLogged.datoscliente.fechaNacimiento.substring(3, 5);
      document.getElementById("anio").value =
        clienteLogged.datoscliente.fechaNacimiento.substring(6, 10);
      document.getElementById("textArea").value =
        clienteLogged.datoscliente.descripcion;
      document.getElementById("imagenUsuario").src =
        clienteLogged.datoscliente.cuenta.imagenAvatarBASE64;

      //seFormdata
      setFormData({
        ...FormData,
        email: clienteLogged.datoscliente.cuenta.email,
        nombre: clienteLogged.datoscliente.nombre,
        apellidos: clienteLogged.datoscliente.apellidos,
        telefono: clienteLogged.datoscliente.telefono,
        usuario: clienteLogged.datoscliente.cuenta.login,
        genero: clienteLogged.datoscliente.genero,
        dia: clienteLogged.datoscliente.fechaNacimiento.substring(0, 2),
        mes: clienteLogged.datoscliente.fechaNacimiento.substring(3, 5),
        anio: clienteLogged.datoscliente.fechaNacimiento.substring(6, 10),
        descripcion: clienteLogged.datoscliente.descripcion,
      });
    }
    actualizarStaateFormData();
  }, [direcciones]);
  useEffect(() => {
    function recuperarDirecciones() {
      let _direcciones = clienteLogged.datoscliente.direcciones;
      setDirecciones(_direcciones);
    }
    recuperarDirecciones();
  }, [clienteLogged]);

  useEffect(() => {
    async function recuperarOpiniones() {
      let response = await clienteRESTService.GetOpiniones(clienteLogged.jwt);
      console.log("respuesta del servicio rest...", response);
      setOpiniones(response._valoraciones);
      console.log("opiniones del cliente:", opiniones);
    }
    recuperarOpiniones();
  }, []);
  //#endregion

  //#region --------------- funciones manejadoras de eventos ----------------------------------------------------

  //function para leer el src del input de la foto
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        document.getElementById("imagenUsuario").src = reader.result;
        setAvatarCliente(reader.result);
        document.getElementById("botonUploadImagen").disabled = false;
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSendImage(ev) {
    let response = await clienteRESTService.ActualizarAvatarCliente({
      jwt: clienteLogged.jwt,
      avatar: avatarCliente,
    });
    console.log("respuesta del servicio rest...", response);
    dispatch({ type: "ACTUALIZAR_AVATAR", payload: avatarCliente });
  }

  function handleChange(event) {
    setFormData({
      ...FormData,
      [event.target.name]: event.target.value,
    });
    console.log("datos del form:", FormData);

    if (FormData.password === FormData.reppass) {
      document.getElementById("submit").removeAttribute("disabled");
    } else {
      document.getElementById("submit").setAttribute("disabled", "truef");
    }
  }

  function HandleDeleteDir(ev) {
    async function borrarDireccion() {
      let response = await clienteRESTService.BorrarDireccion({
        idDireccion: ev.target.id,
        jwt: clienteLogged.jwt,
      });
      console.log("respuesta del servicio rest...", response);
      setDirecciones(direcciones.filter((dir) => dir._id !== ev.target.id));
      dispatch({
        type: "ACTUALIZAR_DIRECCIONES_CLIENTE",
        payload: { _id: ev.target.id },
      });
    }
    borrarDireccion();
  }
  function HandleStateInChild(direccion) {
    const index = direcciones.findIndex((dir) => dir._id === direccion._id);

    if (index !== -1) {
      setDirecciones(
        direcciones.map((dir, i) => (i === index ? direccion : dir))
      );
    } else {
      setDirecciones([...direcciones, direccion]);
    }
  }
  function HandleSubmit(ev) {
    ev.preventDefault();
    let _fechaNacimiento =
      FormData.dia + "-" + FormData.mes + "-" + FormData.anio;
    let datosCliente = {
      email: FormData.email,
      password: FormData.password,
      nombre: FormData.nombre,
      apellidos: FormData.apellidos,
      telefono: FormData.telefono,
      usuario: FormData.usuario,
      genero: FormData.genero,
      fechaNacimiento: _fechaNacimiento,
      descripcion: FormData.descripcion,
    };
    console.log("datos del form a enviar:", datosCliente);
    async function actualizarDatosCliente() {
      let response = await clienteRESTService.ActualizarDatosCliente(
        clienteLogged.jwt,
        datosCliente
      );

      if (response.codigo === 0) {
        console.log("respuesta del servicio rest...", response);
        //setClienteLogged({datoscliente:response.datoscliente, jwt:response.tokensesion})
        dispatch({
          type: "ACTUALIZAR_DATOS_CLIENTE",
          payload: {
            datoscliente: response.datoscliente,
            jwt: response.tokensesion,
          },
        });
        alert("Datos actualizados correctamente");
      } else {
        alert("Error al actualizar los datos");
      }
    }
    actualizarDatosCliente();
  }

  //#endregion

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2>Mi perfil</h2>
          <div></div>
          <div
            className="alert alert-secondary"
            data-bs-toggle="collapse"
            href="#collapseDatos"
          >
            Datos de perfil
          </div>
          <div className="collapse" id="collapseDatos">
            <form onSubmit={HandleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <div className="row text-muted">Correo electrónico</div>
                  <div className="row">
                    <input
                      type="text"
                      id="inputEmail"
                      className="input-group-text"
                      name="email"
                      style={{ width: "90%" }}
                      disabled
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row text-muted">Contraseña</div>
                  <div className="row">
                    <input
                      type="password"
                      id="inputPass"
                      className="input-group-text"
                      name="password"
                      style={{ width: "90%" }}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row text-muted">Nombre</div>
                  <div className="row">
                    <input
                      type="text"
                      id="inputNombre"
                      className="input-group-text"
                      style={{ width: "90%" }}
                      name="nombre"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="row text-muted">Teléfono</div>
                  <div className="row">
                    <input
                      type="text"
                      id="inputTlfn"
                      className="input-group-text"
                      style={{ width: "90%" }}
                      name="telefono"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row text-muted">Repetir la contraseña</div>
                  <div className="row">
                    <input
                      type="password"
                      id="inputPassRep"
                      className="input-group-text"
                      style={{ width: "90%" }}
                      name="reppass"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row text-muted">Apellidos</div>
                  <div className="row">
                    <input
                      type="text"
                      id="inputApellidos"
                      className="input-group-text"
                      style={{ width: "90%" }}
                      name="apellidos"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <span></span>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <div className="text-muted">Foto</div>
                  <div
                    id="avatarPerfil"
                    className="card"
                    style={{
                      width: "200px",
                      height: "250px",
                      backgroundColor: "aliceblue",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="selectorImagen"
                      onChange={handleFileChange}
                    />

                    <img
                      className="imf-fluid"
                      id="imagenUsuario"
                      style={{ height: "auto", width: "12em" }}
                      alt="..."
                      onClick={() => {
                        document.getElementById("selectorImagen").click();
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-link btn-sm"
                    id="botonUploadImagen"
                    onClick={handleSendImage}
                  >
                    {" "}
                    + Sube una foto
                  </button>
                  <div id="mensajeServicioREST"></div>
                </div>
                <div className="col-sm-8">
                  <div className="row text-muted">Usuario</div>
                  <div className="row">
                    <input
                      type="text"
                      id="inputUsuario"
                      className="input-group-sm"
                      name="usuario"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row text-muted">Genero</div>
                  <div className="row">
                    <select
                      className="form-select"
                      id="genero"
                      aria-label="Elige genero"
                      name="genero"
                      onChange={handleChange}
                    >
                      <option value="0" selected>
                        Elige genero
                      </option>
                      <option value="Hombre">Hombre</option>
                      <option value="Mujer">Mujer</option>
                    </select>
                  </div>
                  <div className="row text-muted">Fecha de nacimiento</div>
                  <div className="row">
                    <div className="col-sm-4">
                      <select
                        id="dia"
                        className="form-select"
                        name="dia"
                        onChange={handleChange}
                      >
                        <option value="-1" defaultValue={true}>
                          Elige día
                        </option>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-4">
                      <select
                        id="mes"
                        className="form-select"
                        name="mes"
                        onChange={handleChange}
                      >
                        <option value="-1" defaultValue={true}>
                          Elige mes
                        </option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-4">
                      <select
                        id="anio"
                        className="form-select"
                        name="anio"
                        onChange={handleChange}
                      >
                        <option value="-1" defaultValue={true}>
                          Elige año
                        </option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row text-muted">Descripcion</div>
                  <div className="row">
                    <textarea id="textArea" name="descripcion"></textarea>
                  </div>
                  <div className="ro2 align-text-top m-2">
                    <a href=""> Darme de baja</a>
                    <button
                      type="submit"
                      id="submit"
                      className="m-10 btn btn-primary"
                      disabled
                    >
                      Modificar Datos
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div
            className="alert alert-secondary"
            data-bs-toggle="collapse"
            href="#collapseDirecciones"
          >
            Direcciones
          </div>
          <div className="collapse" id="collapseDirecciones">
            <div>
              <p>
                {" "}
                Guarda todas tus direcciones de envío y elige la que usarás por
                defecto donde llegarán tus pedidos.
              </p>

              <p>
                {" "}
                Estas son las direcciones a las que puedes hacer tus envíos. Las
                direcciones de envío serán las que elijas mientras que la
                facturación será la misma en todas las direcciones:
              </p>
            </div>
            <hr />
            {/*-- listado de direcciones del cliente para borrar/modificar --*/}

            <dir className="col">
              {direcciones.map((dir) => {
                return (
                  <>
                    <div className="col border-top m-3" key={dir._id}>
                      {dir.esPrincipal ? (
                        <p className="font-weight-light">Predeterminada</p>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <div className="d-flex justify-content-around">
                      <div className="d-flex justify-content-md-start">
                        <span className="p-2">{dir.calle}</span>
                        <span className="p-2">{dir.DMUN50}</span>
                        <span className="p-2">{dir.pais}</span>
                      </div>
                      <div className="d-flex justify-content-md-end">
                        <button
                          className="btn btn-primary p-2 m-2 "
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                          onClick={() => setDireccion(dir)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-primary p-2 m-2"
                          id={dir._id}
                          onClick={HandleDeleteDir}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </>
                );
              })}
            </dir>

            {/*-- Button trigger modal --*/}
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onClick={() => setDireccion(null)}
            >
              + Nueva Direccion
            </button>

            {/*-- Modal --*/}
            <ModalDirecciones
              id={Math.random()}
              direccion={direccion}
              change={HandleStateInChild}
            ></ModalDirecciones>
          </div>

          <div
            className="alert alert-secondary"
            data-bs-toggle="collapse"
            href="#collapseOpiniones"
          >
            Opiniones
          </div>

          <div className="collapse" id="collapseOpiniones">
            <h2> Mis opiniones</h2>
            {opiniones?
            (
              opiniones.map((opinion) => {
                return (
                  <>
                    <Opinion opinion={opinion} key={opinion._id} />
                  </>
                );
              })
            
            )
            :
            (
              <p>loading</p>
            )
            }
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default InicioPanel;

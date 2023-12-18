import { Outlet, useLoaderData, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "./Footer";
//import Header from "./Header";
import Headerv2 from "./Headerv2";
import { useClienteLoggedContext } from "../../../context-providers/clienteLoggedContext";

function Layout() {
  let _listacategorias = useLoaderData(); //<---- el hook useLoaderData recupear del loader asociado los datos....
  let _location = useLocation(); //<------------- hook para obtener objeto Location actual
  console.log("objeto location...", _location);

  console.log("categorias recuperadas desde nodejs...", _listacategorias);
  const [avatarCliente, setAvatarCliente] = useState(null);

  let { clienteLogged } = useClienteLoggedContext();

  useEffect(() => {
    function recuperarAvatar() {
      if (!clienteLogged) return;
      let _avatar = clienteLogged.datoscliente.cuenta.imagenAvatarBASE64;
      setAvatarCliente(_avatar);
      console.log("avatar recuperado...", avatarCliente);
    }
    recuperarAvatar();
  }, [clienteLogged]);

  return (
    <>
      <Headerv2 />

      <div className="container">
        <div className="row">
          {/* ----- columna para categorias ------ */}
          <div className="col-3">
            {!new RegExp("/Cliente/Panel/.*").test(_location.pathname) ? (
              <>
                <h6>Categorias</h6>
                <div className="list-group">
                  {_listacategorias.map((cat) => (
                    <Link
                      key={cat.IdCategoria}
                      to={"/Tienda/Libros" + cat.IdCategoria}
                      className="list-group-item list-group-item-action"
                    >
                      {cat.NombreCategoria}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h6 className="text-dark mt-4 ms-3">
                  PANEL PERSONAL DEL CLIENTE
                </h6>
                <div className="container">
                  <div className="row" style={{ background: "#ededed" }}>
                    <div className="col text-center mt-3">
                      {avatarCliente ? (
                        <>
                          <img
                            src={avatarCliente}
                            style={{ height: "auto", width: "10rem" }}
                            className="img-fluid"
                            alt="..."
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src="/images/imagen_usuario_sinavatar.jpg"
                            style={{ height: "auto", width: "10rem" }}
                            alt="..."
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="row" style={{ background: "#ededed" }}>
                    <div className="col">
                      <p className="text-muted">
                        <small>Bienvenido {clienteLogged.datoscliente.nombre+ '  ' + clienteLogged.datoscliente.apellidos}  ( {clienteLogged.datoscliente.cuenta.email})</small>
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="list-group">
                        {_listacategorias.map((cat) => (
                          <Link className="list-group-item list-group-item-action border border-end-0 border-start-0 text-dark" 
                          key={Math.random()}
                          to={`/Cliente/Panel/${cat.replace(/\s/g,'')}`}
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ------ columna para mostrar en funcion del path, el componente segun REACT-ROUTER ---- */}
          <div className="col-9">
            <Outlet></Outlet>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Layout;

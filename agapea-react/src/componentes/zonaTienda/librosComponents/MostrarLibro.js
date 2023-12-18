import Valoracion from "./Valoracion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; //<---- hook de REACT-ROUTER para extraer parametros de la ruta (path)
//devuleve un objeto asi: { nombre_parametro: valor, nombre_parametro: valor, ....}
import { useClienteLoggedContext } from "../../../context-providers/clienteLoggedContext";
import tiendaRESTService from "../../../servicios/restTienda";
import ModalInformacion from "./ModalesListas/ModalInformacion";
import ModalNuevaLista from "./ModalesListas/ModalNuevaLista";
import clienteRESTService from "../../../servicios/restCliente";

function MostrarLibro() {
  let { isbn13 } = useParams();
  let [libro, setLibro] = useState({});
  const { clienteLogged, dispatch } = useClienteLoggedContext();


  useEffect(function () {
    //hacer peticion fetch para recuperar libro con ese isbn13 y rellenar la variable del state "libro" con setLibro
    //invocando a tiendaRestService.recuperarLibro(....)
    async function peticionLibroAMostrar(isbn) {
      let _librorecup = await tiendaRESTService.recuperarLibro(isbn);
      setLibro(_librorecup);
    }
    peticionLibroAMostrar(isbn13);
  }, []);

  function AddLibroToPedido(ev) {
   
    
  }

  function AddLibroToLista(ev) {

    async function AddLibroToLista(idLista){
      let resp=await clienteRESTService.AddLibroLista(clienteLogged.jwt,idLista,libro._id);
      if(resp.codigo===0){
        alert('Libro añadido correctamente');
      }
      else{
        alert('Error al añadir el libro');
      }
    }
    AddLibroToLista(ev.target.id);
  }

  function handleClickLista(ev){
    if(ev.target.name==="nueva"){
      window.bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevaLista')).show()
    }
    else{
      window.bootstrap.Modal.getOrCreateInstance(document.getElementById('modalInfo')).show()
    }
  }
  return (
    <div className="col">

      <div className="row">
        <div className="col-8">
          <div className="mb-3" style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4" style={{ height: "170px" }}>
                <div className="w-100" style={{ height: "80%" }}>
                  <img
                    src={libro.ImagenLibroBASE64}
                    className="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  id="btnComprar-libro.ISBN13"
                  onClick={AddLibroToPedido}
                >
                  Comprar
                </button>
              </div>
              <div className="col-md-8 ps-1">
                <div className="ms-3">
                  <h5 className="card-title">{libro.Titulo}</h5>
                  <h6 className="card-text">{libro.Autores}</h6>
                  <hr />
                  <h6>Detalles del libro</h6>
                  <div className="row">
                    <div className="col-3">
                      <div className="card-text text-muted">Editorial</div>
                      <div className="card-text text-muted">Edición</div>
                      <div className="card-text text-muted">Páginas</div>
                      <div className="card-text text-muted">Dimensiones</div>
                      <div className="card-text text-muted">Idioma</div>
                      <div className="card-text text-muted">ISBN</div>
                      <div className="card-text text-muted">ISBN-10</div>
                    </div>
                    <div className="col-9 ps-4">
                      <div className="card-text">{libro.Editorial}</div>
                      <div className="card-text">{libro.Edicion}</div>
                      <div className="card-text">{libro.NumeroPaginas} </div>
                      <div className="card-text">{libro.Dimensiones}</div>
                      <div className="card-text">{libro.Idioma}</div>
                      <div className="card-text">{libro.ISBN13}</div>
                      <div className="card-text">{libro.ISBN10}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-4 px-0">
          <div className="bg-light p-3 border border-1">
            <div className="container bg-white border border-1 p-2">
              <div className="d-flex flex-row-reverse align-items-end w-100">
                <h4 className="mx-2">€</h4>
                <h2>{libro.Precio}</h2>
              </div>
              <div className="container px-3">
                <div className="row">
                  <div className="col-4 border border-2 border-primary d-flex align-items-center justify-content-center">
                    <img src="/images/iconoMiniBan.png" />
                  </div>
                  <div className="col-8 border border-2 border-primary border-start-0 d-flex flex-column justify-content-center p-2">
                    <div className="d-flex justify-content-around">
                      <span className="text-primary">
                        <strong>Envío Gratis</strong>
                        <i className="fa-solid fa-circle-info mx-2"></i>
                      </span>{" "}
                    </div>
                    <div className="d-flex justify-content-around">
                      <span className="text-primary">
                        <small>al comprar este libro</small>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center py-3 px-1">
                <button
                  className="btn btn-primary w-100 p-2"
                  id={"btnComprar-" + libro.ISBN13}
                  onClick={AddLibroToPedido}
                  style={{ borderRadius: "0px" }}
                >
                  <i className="fa-solid fa-cart-shopping pe-2"></i>
                  <strong> Comprar / Recoger</strong>
                </button>
              </div>
             {
              clienteLogged ? (
                <div className="d-flex flex-row justify-content-between px-1">
                <button
                  className="btn btn-outline-primary p-2 flex-fill"
                  style={{ borderRadius: "0px" }}
                  id={clienteLogged.datoscliente.listas[0]._id}
                  onClick={AddLibroToLista}
                >
                  {" "}
                  <small>Agregar a  {clienteLogged.datoscliente.listas[0].Nombre}</small>
                </button>

                <a
                  id="despliega-listas"
                  className="btn btn-outline-primary ms-2 border border-1 border-primary position-relative"
                  style={{ borderRadius: "0px" }}
                >
                
                <div class="dropdown">
                  <button class="btn  dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    :
                  </button>
                  <ul class="dropdown-menu">
                    {clienteLogged.datoscliente.listas.map((lista)=>{
                      return(
                        <li><button class="dropdown-item" id={lista._id} onClick={AddLibroToLista}>{lista.Nombre}</button></li>
                      )
                    })}
                    <li><button class="dropdown-item" name="nueva"onClick={handleClickLista}>Añadir a una nueva lista </button></li>
                    <li><button class="dropdown-item" name="info"onClick={handleClickLista}>Ver mas listas  </button></li>
                  </ul>
                </div>
                 
                  <div
                    className="position-absolute top-100 start-0 visually-hidden"
                    id="dropdown-listas"
                    style={{ width: "150px" }}
                  >
                    <div
                      className="btn btn-outline-primary w-100"
                      style={{ borderRadius: "0px" }}
                    >
                      
                    </div>
                    <div
                      className="btn btn-outline-primary border-top-0 w-100"
                      style={{ borderRadius: "0px" }}
                    >
                      Ver más listas
                    </div>
                  </div>
                </a>
              </div>
              )
              :
              (
                <div></div>
              )
             }
            </div>
          </div>
        </div>
      </div>
      {
        clienteLogged ? (
          <div>
          <ModalInformacion id={Math.random} listas={clienteLogged.datoscliente.listas} libro={libro}/>
          <ModalNuevaLista libro={libro}/>
          </div>
        )
        :
        (
          <div></div>
        )
       }
      <Valoracion isbn13={isbn13} />
    </div>
  );
}
export default MostrarLibro;

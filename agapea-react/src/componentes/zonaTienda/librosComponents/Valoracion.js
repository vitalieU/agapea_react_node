import { useState, useEffect } from "react";
import tiendaRESTService from "../../../servicios/restTienda";
import clienteRESTService from "../../../servicios/restCliente";
import { useClienteLoggedContext } from "../../../context-providers/clienteLoggedContext";

export default function Valoracion({ isbn13 }) {
  const [valoraciones, setValoraciones] = useState([]);
  const { clienteLogged, dispatch } = useClienteLoggedContext();
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    async function fetchData() {
      let resp = await tiendaRESTService.recuperarValoraciones(isbn13);
      if (resp.codigo === 0) {
        setValoraciones(resp.valoraciones);
      }
      console.log("valoraciones...", valoraciones);
    }
    fetchData();
  }, [comentario]);

  async function addValoracion(isbn13, valoracion) {
    let resp = await clienteRESTService.AddValoracion(
      clienteLogged.jwt,
      isbn13,
      valoracion
    );
    console.log("resp...", resp);
    return resp;
  }
  async function addComentario(isbn13, comentario) {
    let resp = await clienteRESTService.AddComentario(
      clienteLogged.jwt,
      isbn13,
      comentario
    );
    console.log("resp...", resp);
    return resp;
  }

  async function HandleChange(ev) {
    if (clienteLogged === null) {
      alert("Debes estar logueado para poder valorar un libro");
    } else {
      const dataValue = ev.target.getAttribute("data-value");
      const _response = await addValoracion(isbn13, dataValue);
      if (_response.codigo === 0) {
        let comentario = window.prompt(
          "Valoracion introducida correctamente, ahora introduce un comentario"
        );
        const _response2 = await addComentario(
          _response.idValoracion,
          comentario
        );

        if (_response2.codigo === 0) {
          alert("Comentario introducido correctamente");
          setComentario(comentario);
        }
      }
    }
  }

  if (valoraciones.length === 0) {
    return <p>loading</p>;
  } else {
    return (
      <>
        <div className="container-fluid">
          <div className="d-flex flex-column justify-content-between">
            <h4 className="border-bottom d-flex justify-content-center">
              Danos tu valoracion de este libro
            </h4>
            <form>
              <div class="rating d-flex justify-content-center border-bottom">
                <input
                  type="radio"
                  id={"star5"}
                  name="rating"
                  htmlFor={"star5"}
                  data-value="5"
                  onChange={HandleChange}
                />
                <label
                  for="star5"
                  class="star"
                  value="5"
                  data-value="5"
                ></label>
                <input
                  type="radio"
                  id={"star4"}
                  name="rating"
                  htmlFor={"star4"}
                  data-value="4"
                  onChange={HandleChange}
                />
                <label for="star4" class="star" data-value="4"></label>
                <input
                  type="radio"
                  id={"star3"}
                  name="rating"
                  htmlFor={"star3"}
                  data-value="3"
                  onChange={HandleChange}
                />
                <label for="star3" class="star" data-value="3"></label>
                <input
                  type="radio"
                  id={"star2"}
                  name="rating"
                  htmlFor={"star2"}
                  data-value="2"
                  onChange={HandleChange}
                />
                <label for="star2" class="star" data-value="2"></label>
                <input
                  type="radio"
                  id={"star1"}
                  name="rating"
                  htmlFor={"star1"}
                  data-value="1"
                  onChange={HandleChange}
                />
                <label for="star1" class="star" data-value="1"></label>
              </div>
              <div id="result"></div>
            </form>
            {valoraciones.map((valoracion) => {
              return (
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-column">
                    <p>{valoracion.username}</p>
                    <p className="">
                      {[...Array(valoracion.valoracion).keys()].map((i) => {
                        return (
                          <img
                            src="/images/star-empty.png"
                            style={{ height: "auto", width: "1rem" }}
                          />
                        );
                      })}
                    </p>
                    <p>{valoracion.comentario}</p>
                  </div>
                  <p>{valoracion.fecha.substring(0, 9)}</p>
                </div>
              );
            })}
            <button></button>
          </div>
        </div>
      </>
    );
  }
}

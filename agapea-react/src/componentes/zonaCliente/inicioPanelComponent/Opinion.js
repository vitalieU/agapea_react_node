import { Link } from "react-router-dom";
import "./Opinion.css";
import { useEffect, useState } from "react";
import clienteRESTService from "../../../servicios/restCliente";
import { useClienteLoggedContext } from "../../../context-providers/clienteLoggedContext";

export default function Opinion({ opinion }) {
  const [selectedRating, setSelectedRating] = useState(null);
  const [comentario, setComentario] = useState(opinion.comentario);
  let { clienteLogged } = useClienteLoggedContext();

  useEffect(() => {
    const star = "star" + opinion.valoracion + opinion._id;
    document.getElementById(star).checked = true;
    setSelectedRating(opinion.valoracion);
    
  }, []);

  function HandleStarClick(ev) {
    const dataValue = ev.target.getAttribute("data-value");
    console.log("click en estrella...", dataValue);
    setSelectedRating(dataValue);
    const star = "star" + dataValue + opinion._id;
    document.getElementById(star).checked = true;
    document.getElementById("boton" + opinion._id).hidden = false;
  }

  function handleComentarioChange(event) {
    setComentario(event.target.value);
    document.getElementById("boton" + opinion._id).hidden = false;
  }

  async function HandleSubmit(ev){
    ev.preventDefault();
    const jwt=clienteLogged.jwt;
    const id =opinion._id
    let resp= await clienteRESTService.UpdateValoracion(jwt,id,selectedRating,comentario);
    if(resp.codigo===0){
      alert('Valoracion actualizada correctamente');
    }
    else{
        alert('Error al actualizar la valoracion');
    }
  }

  return (
    <div className="row p-3 m-2">
      <div className="col-3">
        <img
          src={opinion.IdLibro.ImagenLibroBASE64}
          alt=""
          style={{ height: "auto", width: "5em" }}
        />
      </div>
      <div className="col-5">
        <Link key={opinion._id} to={'../../Tienda/MostrarLibro/'+opinion.IdLibro.ISBN13}> {opinion.IdLibro.Titulo}</Link>
        <p>{opinion.IdLibro.Autores}</p>
      </div>

      <div className="col-4">
        <div className="col">
          <form onSubmit={HandleSubmit}>
            <div class="rating" onClick={HandleStarClick}>
              <input
                type="radio"
                id={"star5" + opinion._id}
                name="rating"
                htmlFor={"star5" + opinion._id}
              />
              <label for="star5" class="star" value="5" data-value="5"></label>
              <input
                type="radio"
                id={"star4" + opinion._id}
                name="rating"
                htmlFor={"star4" + opinion._id}
              />
              <label for="star4" class="star" data-value="4"></label>
              <input
                type="radio"
                id={"star3" + opinion._id}
                name="rating"
                htmlFor={"star3" + opinion._id}
              />
              <label for="star3" class="star" data-value="3"></label>
              <input
                type="radio"
                id={"star2" + opinion._id}
                name="rating"
                htmlFor={"star2" + opinion._id}
              />
              <label for="star2" class="star" data-value="2"></label>
              <input
                type="radio"
                id={"star1" + opinion._id}
                name="rating"
                htmlFor={"star1" + opinion._id}
              />
              <label for="star1" class="star" data-value="1"></label>
            </div>
            <div id="result"></div>

            <div class="form-group">
              <label for={"comentario" + opinion._id}>Comentario</label>
              <textarea
                className="form-control"
                id={"comentario" + opinion._id}
                value={comentario}
                onChange={handleComentarioChange}
                placeholder="Escribe tu comentario aquí..."
              ></textarea>
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              id={"boton" + opinion._id}
              hidden
            >
              Gurardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

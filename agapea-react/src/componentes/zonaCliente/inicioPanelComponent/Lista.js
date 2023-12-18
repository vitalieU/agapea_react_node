import { useParams } from "react-router-dom"
import { useClienteLoggedContext } from "../../../context-providers/clienteLoggedContext";
import { useState } from "react";
import clienteRESTService from "../../../servicios/restCliente";

export default function Lista(){

    const {idLista}=useParams();
    const { clienteLogged, dispatch } = useClienteLoggedContext();
    const [lista, setLista] = useState(clienteLogged.datoscliente.listas.find((lista)=>lista._id===idLista));

    function HandleRemoveBookClick(ev){
        const idLibro=ev.target.id;
        const resp=clienteRESTService.BorrarLibroLista(clienteLogged.jwt,idLista,idLibro);
        if(resp.codigo===0){
            alert('Libro eliminado correctamente');
           setLista(clienteLogged.datoscliente.listas.find((lista)=>lista._id===idLista));
        }
    }

    return(

        <div>
            <div className="row m-4">
                <h3>{lista.Nombre}</h3>
                <img src="/images/edit-property-16.jpg" style={{width:"auto",height:"2rem"}}></img>
            </div>
            <p className="m-4">{lista.Descripcion}</p>
            {
                lista.EsPublica ? <p className="m-4">* Lista privada</p> : <p className="m-4">*Lista publica</p>
            }
            {
        lista.Libros.map((libro)=>{
            return(
                <>
                <div className="row p-3 m-2" key={libro._id}>
                    <div className="col-3">
                        <img src={libro.ImagenLibroBASE64} alt="" style={{height:"auto", width:"5em"}}/>
                    </div>
                    <div className="col-5">
                        <p>{libro.Titulo}</p>
                        <p>{libro.Autores}</p>
                    </div>
                    <div className="col-4">
                        <p>{libro.Precio}€</p>
                        <button className="btn btn-danger" id={libro._id} onClick={HandleRemoveBookClick}>Eliminar</button>
                    </div>
                    <button className="btn bg-primary m-2">Comprar</button>
                </div>
                </>
            )
        })
            }
        </div>

    
    )
}
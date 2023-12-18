import { useClienteLoggedContext } from "../../../context-providers/clienteLoggedContext";
import { Link } from "react-router-dom";
import ModalNuevaLista from "./ModalNuevaLista";
import clienteRESTService from "../../../servicios/restCliente";
export default function Listas(){
    const { clienteLogged, dispatch } = useClienteLoggedContext();

    function handleNewListaClick(ev){
        window.bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevaLista2')).show()
    }

    async function HandleDeleteList(ev){
        const id=ev.target.id;
        const resp = await clienteRESTService.BorrarLista(clienteLogged.jwt,id);
        if(resp.codigo===0){
            alert('Lista borrada correctamente');
        }   
    }

    return(
        <div className="col p-3 m-2">
            <h3>Mi biblioteca</h3>
            <button type="button" className="btn btn-primary " onClick={handleNewListaClick}>Crear nueva lista</button>
            {
                clienteLogged.datoscliente.listas.map((lista)=>{
                    return (
                        <>
                        <div className="row p-3 ">
                            <div className="col-6 border-bottom">
                                <div className="d-flex justify-content-between">
                                <img className="m-3" src="/images/hover-lista.png" alt="..." style={{radius:"10px"}}></img>
                                <button type="button" className="btn btn-link" onClick={HandleDeleteList} id={lista._id}><img className="" id={lista._id} src="/images/x-mark-16.jpg" alt="..."></img></button>
                                </div>
                                {lista.EsPrincipal ? <p className="fw-lighter">Lista principal</p> : 
                                    <p className="fw-lighter">Lista secundaria</p>}
                                <Link key={lista._id} to={'./'+lista._id}>{lista.Nombre}</Link>
                            </div>
                            
                        </div>    
                        </>
                    )
                })
            }
            <ModalNuevaLista/>
        </div>
    )
}
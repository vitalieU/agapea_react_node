import {useState} from 'react';
import clienteRESTService from "../../../../servicios/restCliente";
import { useClienteLoggedContext } from "../../../../context-providers/clienteLoggedContext";


export default function ModalNuevaLista({libro}) {
    const [lista, setLista] = useState({nombreLista:'', comentario:''});
    const { clienteLogged, dispatch } = useClienteLoggedContext();
    console.log('librooooo...', libro);

    function handleChange(ev){

        setLista({...lista, [ev.target.id]:ev.target.value});
    }
    async function handleClickGuardar(ev){
        ev.preventDefault();
        if(libro===null){
          const resp=await clienteRESTService.AddLibroNewLista(clienteLogged.jwt,lista.nombreLista,lista.comentario,libro._id);
          if(resp.codigo===0){
              alert('Libro añadido correctamente');
              window.bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevaLista')).hide();
            }
        }
        else{
          const resp=await clienteRESTService.CrearLista(clienteLogged.jwt,lista.nombreLista,lista.comentario);
          if(resp.codigo===0){
              alert('Libro añadido correctamente');
              window.bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevaLista')).hide();
            }
        }

    }
 return(

<div class="modal fade" id="modalNuevaLista" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir el libro a una nueva lista</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
       <form>
       <div class="mb-3">
            <label for="nombreLista" class="form-label">Nombre de la lista</label>
            <input type="text" class="form-control" id="nombreLista" placeholder="el nombre de la lista" onChange={handleChange}/>
            </div>
            <div class="mb-3">
            <label for="comentario" class="form-label">Comentario</label>
            <textarea class="form-control" id="comentario" rows="3" onChange={handleChange}></textarea>
        </div>
        </form> 
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary" onClick={handleClickGuardar}>Guardar</button>
      </div>
    </div>
  </div>
</div>
 )
}
import clienteRESTService from "../../../../servicios/restCliente"
import { useClienteLoggedContext } from "../../../../context-providers/clienteLoggedContext"
import { useState, useEffect } from "react";
import ModalNuevaLista from "./ModalNuevaLista";

export default function ModalInformacion(props) {

    const [opciones, setOpciones] = useState(props.listas.map((lista) => {return { opcion: lista.Nombre, 
                                                                    isChecked: lista.Libros.includes(props.libro) 
                                                                     }
                                                                    }));


     function HandleCreateList(ev){
        ev.preventDefault();
        window.bootstrap.Modal.getOrCreateInstance(document.getElementById('modalInfo')).hide();
        window.bootstrap.Modal.getOrCreateInstance(document.getElementById('modalNuevaLista')).show();

        
     }                                                               
    

    return (
<div class="modal fade" id="modalInfo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir a una lista</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-check border-bottom border-top">

                {
                    opciones.map((lista) => {
                        
                        return (
                            <div key={lista.opcion}>
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    value={lista.opcion} 
                                    id={lista.opcion} 
                                    checked={lista.isChecked}
                                />
                                <label className="form-check-label" htmlFor={lista.opcion}>{lista.opcion}</label>
                            </div>
                        )
                    })
                }

                </div>
                <button type="button" class="btn btn-outline-secondary" onClick={HandleCreateList}> + Crear nueva lista</button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Guradar</button>
            </div>
          </div>
        </div>
      </div> 
    )
}
//componente que representara un elemento del pedido, recibe como propiedad el elemento a pintar del comp.
//padre: Pedido.js <---- recibe del contexto global los elementos del pedido

import { useItemsCarroContext } from '../../../context-providers/itemsCarroContext';

function ElementoPedidov2( { item } ){
    let { itemsCarro, dispatch }=useItemsCarroContext();

    let { libroElemento, cantidadElemento}=item;

    function BotonClickHandler(ev){
        //funcion manejadora de eventos click de botones Eliminar, sumar, restar
        //en el ev.target <--- boton q ha provocado evento, en su propiedad .name estaria el atributo "name" del mismo
        let [ name, isbn13 ]=ev.target.name.split('-');
        
        let _libroOperar=itemsCarro.filter(item=>item.libroElemento.ISBN13===isbn13).map( el=> el.libroElemento)[0];
        let _action={type:'', payload:{ libroElemento: _libroOperar}}

        switch (name) {
            case 'botonEliminar':
                _action.type='QUITA_LIBRO_CARRO';
                break;

            case 'botonSumar': 
                _action.type='SUMAR_CANTIDAD_LIBRO';
                break;

            case 'botonRestar':
                _action.type='RESTAR_CANTIDAD_LIBRO';
                break;
        
            default:
                break;
        }
        dispatch(_action);
    }

    return (
                <div className="card mb-3" style={{ maxwidth: "540px" }}>
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img src={libroElemento.ImagenLibroBASE64} className="img-fluid rounded-start" alt="..." />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body">
                          
                          <div className="d-flex flex-row justify-content-between">
                            <h5 className="card-title">{libroElemento.Titulo}</h5>
                            {/*boton para eliminar libro de elementos pedido*/}
                            <button className="btn btn-light btn-sm" name={'botonEliminar-'+ libroElemento.ISBN13} onClick={BotonClickHandler} > X </button>
                          </div>
                          
                          <div className="d-flex flex-row justify-content-between">
                            {/*boton +, label cantidad, boton -  el precio del libro y subtotal elemento pedido*/}
                            <button className="btn btn-outline-primary btn-sm" name={'botonRestar-'+ libroElemento.ISBN13} onClick={BotonClickHandler} > - </button>

                            <label> <small>{cantidadElemento}</small> </label>

                            <button className="btn btn-outline-primary btn-sm" name={'botonSumar-'+ libroElemento.ISBN13} onClick={BotonClickHandler} >  + </button>

                            <label>
                              <small>x</small>
                              <span style={{ color: "red" }}> {libroElemento.Precio}€ </span>
                            </label>
                            <label style={{ color: "red" }}> {libroElemento.Precio * cantidadElemento}€ </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> 
    );
}

export default ElementoPedidov2;
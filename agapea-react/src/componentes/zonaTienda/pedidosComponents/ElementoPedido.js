//componente que representara un elemento del pedido, recibe como propiedad el elemento a pintar del comp.
//padre: Pedido.js <---- recibe del contexto global los elementos del pedido

import { useItemsCarroContext } from '../../../App'; //<---- del hook de acceso al contexto-global del proveedor de ItemsCarroProvider extraigo la funcion setter

function ElementoPedido( { item } ){
    let { itemsCarro,setItemsCarro }=useItemsCarroContext();

    let { libroElemento, cantidadElemento}=item;

    function BotonClickHandler(ev){
        //funcion manejadora de eventos click de botones Eliminar, sumar, restar
        //en el ev.target <--- boton q ha provocado evento, en su propiedad .name estaria el atributo "name" del mismo
        let [ name, isbn13 ]=ev.target.name.split('-');
        console.log('has pulsado el boton...', name, isbn13);

        //ahora tendria q modificar el array itemsCarro sin MUTARLO!!!! (haria la funcion del comp.impura)

        switch (name) {
            case 'botonEliminar': //para no mutar el array itemsCarro, .filter sobre el mismo
                setItemsCarro( itemsCarro.filter( item=> item.libroElemento.ISBN13 !== isbn13) );
                
                break;
            case 'botonSumar': //para no mutar el array itemsCarro, clonarlo y modificar posicion del array donde este el isbn del libro
                              //e incrementar la cantidad en uno
                //esto funcionaria....
                
                // let _newItems=itemsCarro.slice();
                // let _pos=_newItems.findIndex( item=> item.libroElemento.ISBN13===isbn13);
                // _newItems[_pos].cantidadElemento += 1;
                // setItemsCarro(_newItems);

                //pero mejor con itemsCarro.map()...
                setItemsCarro(
                    itemsCarro.map( item => item.libroElemento.ISBN13 === isbn13 ? { ...item, cantidadElemento: item.cantidadElemento + 1 } : item  )
                );

                break;

            case 'botonRestar'://para no mutar el array itemsCarro, clonarlo y modificar posicion del array donde esta el isbn del libro
                              //y decrementar la cantidad en uno, si ya es 0, eliminarlo del array

                setItemsCarro(
                    itemsCarro.map( item => {
                                                if (item.libroElemento.ISBN13===isbn13) {
                                                    const _nuevacantidad=item.cantidadElemento-1;
                                                    return _nuevacantidad > 0 ? { ...item, cantidadElemento: _nuevacantidad } : null;
                                                } else {
                                                    return item;
                                                }
                                 }
                            ).filter(Boolean)
                );
                break;
        
            default:
                break;
        }
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

export default ElementoPedido;
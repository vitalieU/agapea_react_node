//modulo js para definir el state-global con context-api itemsCarro
//usando un reducer....no el state
import { createContext, useContext, useReducer } from 'react';

const ItemsCarroContext=createContext();

//funcion reducer:
const itemsCarroReducer=(state, action)=>{
    //en state esta itemsCarro:  [ { libroElemento:..., cantidadElemento: ..}, { libroElemento:..., cantidadElemento: ..}, ...]
    //en el objeto action.payload={ libroElemento: { .... } }
    
    let _libroOperar=action.payload.libroElemento;

    switch (action.type) {
        case 'ADD_NUEVO_LIBRO_CARRO':
            //comprobamos si el libro a añadir ya existe en la lista de items del state...
            let _posLibro=state.findIndex( item => item.libroElemento.ISBN13===_libroOperar.ISBN13);

            if (_posLibro !== -1) {
                return state.map(
                    item => item.libroElemento.ISBN13===_libroOperar.ISBN13 ? { ...item, cantidadElemento: item.cantidadElemento +1 } : item
                );                    
            } else {
                //no existe, hay q añadirlo de nuevas...
                return [ ...state, { libroElemento: _libroOperar, cantidadElemento:1 } ]
            }

        case 'SUMAR_CANTIDAD_LIBRO':
            return state.map(
                item => item.libroElemento.ISBN13===_libroOperar.ISBN13 ? { ...item, cantidadElemento: item.cantidadElemento +1 } : item
            );

        case 'RESTAR_CANTIDAD_LIBRO':
            return state.map(
                item => {
                    if( item.libroElemento.ISBN13===_libroOperar.ISBN13){
                            //sobre item encontrado, resto cantidad siempre y cuando sea mayor que 0, sino devuelvo null y luego
                            //filtro el array para quitar los null
                            let _nuevaCantidad=item.cantidadElemento - 1;
                            return _nuevaCantidad > 0 ? { ...item, cantidadElemento: _nuevaCantidad }:null;
                    } else {
                        return item;
                    }
                }
                ).filter(Boolean);
        

        case 'QUITA_LIBRO_CARRO':
            return state.filter( item => item.libroElemento.ISBN13 !== _libroOperar.ISBN13);
       
        default:
            return state;
    }
}



//a EXPORTAR: componente que define proveedor del contexto creado, pasando valores globales: itemsCarro y funcion dispatch del reducer
function ItemsCarroProvider( {children} ){
    const [itemsCarro, dispatch ]=useReducer(itemsCarroReducer,[]);

    return (
        <ItemsCarroContext.Provider value={ {itemsCarro, dispatch} }>
            { children }
        </ItemsCarroContext.Provider>
    );
}


//a EXPORTAR: hook personalizado para usar los valores del contexto creado...
function useItemsCarroContext(){
    const _itemsCarroContext=useContext(ItemsCarroContext);
    return _itemsCarroContext;
}


export { ItemsCarroProvider, useItemsCarroContext };
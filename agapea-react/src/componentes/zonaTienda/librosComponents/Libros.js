import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useItemsCarroContext } from '../../../App';

function Libros(){
    let { itemsCarro, setItemsCarro }=useItemsCarroContext();
    let _listaLibros=useLoaderData(); //<----- recupero libros del loader del componente asociado al path...
    const navigate=useNavigate();

    console.log('lista de libros recuperados....', _listaLibros);

    function AddLibroToPedido(ev){
        //añadir libro a lista de items pedido actuales...ev.target.id 
        let _isbn13=ev.target.id.split('-')[1];
        console.log('isbn del libro q quieres comprar....', _isbn13);
        console.log('items carro vale...', itemsCarro);

        //---------------------------------------------------------------------------------------------
        //ESTO ESTA MAL!!!!! no se puede modificar el objeto del state directamente!!!! esto supondria MUTAR el state
        //y eso hace q la funcion del componente sea IMPURA!!! 


        // let _libroAñadir=_listaLibros.find( libro=> libro.ISBN13===_isbn13); 
        // itemsCarro.push( { libroElemento: _libroAñadir, cantidadElemento: 1} ); //<---- estas modificando la variable del state!!!! arrrrrrrrrrghhhh
        // setItemsCarro(itemsCarro);
        //----------------------------------------------------------------------------------------------
        //¿¿ cmo añado el objeto: { libroElemento: _libroAñadir, cantidadElemento: 1} al array del state: itemsCarro sin MUTARLO ??
        // para poder pasarselo a la funcion setItemsCarro ... clonando el array original y añades el nuevo elemento y se lo pasas a la funcion
        let _libroAñadir=_listaLibros.find( libro=> libro.ISBN13===_isbn13);
        setItemsCarro( [...itemsCarro, { libroElemento: _libroAñadir, cantidadElemento: 1} ] )
        navigate('/Tienda/Pedido');
    }

    return (
            <div className="container">
                    <div className="row">
                        {
                            _listaLibros.map(
                                (item) => {
                                    return (
                                        <div className="col-4">
                                            <div className="mb-3" style={{maxWidth: "540px"}} id={"cardLibro-" + item.ISBN13}>
                                                <div className="row g-0">
                                                    {/*<!-- columna para miniimagen del libro y boton comprar--> */}
                                                    <div className="col-md-4 text-center" style={{height: "170px"}}>
                                                        <div className="w-100" style={{height: "80%"}}>
                                                            <Link to={ "/Tienda/MostrarLibro/" + item.ISBN13} >
                                                                <img className="img-fluid rounded-start rounded-end" src={item.ImagenLibroBASE64} alt="..."/>
                                                            </Link>
                                                        </div>
                                                        <button className="btn btn-primary btn-sm" onClick={AddLibroToPedido} id={"btnComprar-" + item.ISBN13}>
                                                                Comprar...
                                                        </button>
                                                    </div>
            
                                                    {/*<!-- columna para titulo del libro, autores, editorial, pags y precio--> */}
                                                    <div className="col-md-8">
                                                        <div className="ms-3">
                                                            <h6 className="card-title" style={{height: "50px"}}><Link to={"/Tienda/MostrarLibro/" + item.ISBN13} className="text-decoration-none" >{item.Titulo}</Link></h6>
                                                            <div className="card-text">{item.Autores}</div>
                                                            <div className="card-text">{item.Editorial}</div>
                                                            <div className="card-text"><small className="text-muted">{item.NumeroPaginas}  páginas</small></div>
                                                            <div className="card-text"><strong>{item.Precio} €</strong></div>
                                                        </div>
                                                    </div>
            
                                            </div>
                                            </div>                    
                                        </div>
                                    );
                                }
                            )
                        }
                        
                    </div>
            </div>
     );
}
export default Libros;
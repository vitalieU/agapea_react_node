import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { useItemsCarroContext } from '../../../context-providers/itemsCarroContext';

function Librosv2(){
    let { dispatch }=useItemsCarroContext();
    let _listaLibros=useLoaderData(); //<----- recupero libros del loader del componente asociado al path...
    const navigate=useNavigate();

    function AddLibroToPedido(ev){
        //añadir libro a lista de items pedido actuales...ev.target.id 
        let _isbn13=ev.target.id.split('-')[1];

        let _libroAñadir=_listaLibros.find( libro=> libro.ISBN13===_isbn13);

        dispatch( { type:'ADD_NUEVO_LIBRO_CARRO', payload:{ libroElemento: _libroAñadir, cantidadElemento: 1} })
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
export default Librosv2;
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { createContext,useContext,useState } from "react";

import tiendaRESTService from "./servicios/restTienda";

import Login from './componentes/zonaCliente/loginComponent/Login';
import Registrov3 from './componentes/zonaCliente/registroComponent/Registrov3';
import Layout from "./componentes/zonaTienda/layoutComponents/Layout";
import Libros from "./componentes/zonaTienda/librosComponents/Libros";
import MostrarLibro from "./componentes/zonaTienda/librosComponents/MostrarLibro";
import Pedido from "./componentes/zonaTienda/pedidosComponents/Pedido";
import InicioPanel from "./componentes/zonaCliente/inicioPanelComponent/InicioPanel";
import Listas from "./componentes/zonaCliente/inicioPanelComponent/Listas";
import Opinion from "./componentes/zonaCliente/inicioPanelComponent/Opinion";
import Compras from "./componentes/zonaCliente/inicioPanelComponent/Compras";


//--------------array de objetos Route creados con metodo createBrowserRouter a pasar al proveedor de rutas RouterProvider----
const routerObjects=createBrowserRouter(
    [
      {
        element: <Layout />,
        loader: tiendaRESTService.recuperarCategorias , //<---- funcion asincrona q se ejecuta de forma paralela a la carga del componente <Layout/> lo vamos a usar para cargar categorias...
        children:[
                    { path:'/',  element:<Navigate to="Tienda/Libros" />},
                    { path:'Tienda/Libros/:idcategoria?', element: <Libros />, loader: tiendaRESTService.recuperarLibros },                    
                    { path:'/Tienda/MostrarLibro/:isbn13', element: <MostrarLibro />} //<---- se podria usar un loader para cargar el libro, pero uso hook: useEffect
                    
        ]
      }, //si quieres usar un layout creas un objeto json si path...y con propiedad children <--- pones rutas hijas q quieres cargar dentro del layout
      { path: '/Cliente/Login', element: <Login/>},
      { path: '/Cliente/Registro', element:<Registrov3/>},
      { path:'/Tienda/Pedido', element: <Pedido/>},
      {
        path: '/Cliente/Panel',
        element: <Layout/>,
        loader: async ()=>{ return ["InicioPanel", 
                                    "Mis Compras",
                                    "Mis Opiniones",
                                    "Mis Listas"] }, //lo suyo seria recup.desde bd 
        children:[
                    { path: 'InicioPanel', element:<InicioPanel/>},
                    { path: 'MisCompras', element:<Compras/>},
                    { path: 'MisOpiniones', element:<Opinion />},
                    { path: 'MisListas', element:<Listas />}
        ]
      }
      
      
    ]
);

// ---------------------------- contextos para pasar variables globales a componentes -----------------
const ClienteLoggedContext=createContext(null);
const ItemsCarroContext=createContext( [] );

function App() {

  let [clienteLogged,setClienteLogged]=useState(null);
  let [itemsCarro, setItemsCarro]=useState([]);

  return (
    <ClienteLoggedContext.Provider value={ { clienteLogged, setClienteLogged } }>
      <ItemsCarroContext.Provider value={ {itemsCarro, setItemsCarro } }>

          <RouterProvider router={routerObjects} />
       
      </ItemsCarroContext.Provider>
    </ClienteLoggedContext.Provider>
    )

}


//---------------- exporto hooks personalizados para q comp.hijos puedan usar variables del contexto global:
//  1º valor: { clienteLogged: {datoscliente: ..., jwt: ...}, setClienteLogged: function(){ ....} }
//  2º valor: { itemsCarro: [ .... ], setItemsCarro: function(){ ....} }

export function useClienteLoggedContext(){
      return useContext(ClienteLoggedContext);
}

export function useItemsCarroContext(){
      return useContext(ItemsCarroContext);
}
// ------------------------------------------------------------------------------------------------------------

export default App;

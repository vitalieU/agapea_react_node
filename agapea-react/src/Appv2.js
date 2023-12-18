import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";

import tiendaRESTService from "./servicios/restTienda";

import Login from './componentes/zonaCliente/loginComponent/Login';
import Registrov3 from './componentes/zonaCliente/registroComponent/Registrov3';
import Layout from "./componentes/zonaTienda/layoutComponents/Layout";
import MostrarLibro from "./componentes/zonaTienda/librosComponents/MostrarLibro";
import Librosv2 from './componentes/zonaTienda/librosComponents/Librosv2';
import Pedidov2 from './componentes/zonaTienda/pedidosComponents/Pedidov2';

import { ClienteLoggedProvider } from './context-providers/clienteLoggedContext';
import { ItemsCarroProvider } from './context-providers/itemsCarroContext';
import InicioPanel from "./componentes/zonaCliente/inicioPanelComponent/InicioPanel";
import FinalizarPedidoOK from "./componentes/zonaTienda/pedidosComponents/FinalizarPedidoOK";
import Compras from "./componentes/zonaCliente/inicioPanelComponent/Compras";
import Opinion from "./componentes/zonaCliente/inicioPanelComponent/Opinion";
import Listas from "./componentes/zonaCliente/inicioPanelComponent/Listas";
import Lista from "./componentes/zonaCliente/inicioPanelComponent/Lista";




//--------------array de objetos Route creados con metodo createBrowserRouter a pasar al proveedor de rutas RouterProvider----
const routerObjects=createBrowserRouter(
    [
      {
        element: <Layout />,
        loader: tiendaRESTService.recuperarCategorias , //<---- funcion asincrona q se ejecuta de forma paralela a la carga del componente <Layout/> lo vamos a usar para cargar categorias...
        children:[
                    { path:'/',  element:<Navigate to="Tienda/Libros" />},
                    { path:'Tienda/Libros/:idcategoria?', element: <Librosv2 />, loader: tiendaRESTService.recuperarLibros },                    
                    { path:'/Tienda/MostrarLibro/:isbn13', element: <MostrarLibro />} //<---- se podria usar un loader para cargar el libro, pero uso hook: useEffect
                    
        ]
      }, //si quieres usar un layout creas un objeto json si path...y con propiedad children <--- pones rutas hijas q quieres cargar dentro del layout
      { path: '/Cliente/Login', element: <Login/>},
      { path: '/Cliente/Registro', element:<Registrov3/>},
      { path:'/Tienda/Pedido', element: <Pedidov2/>},
      { path:'/Pedido/FinalizarPedidoOK', element: <FinalizarPedidoOK/>},
      {
        path: '/Cliente/Panel',
        element: <Layout/>,
        loader: async ()=>{ return ["Inicio Panel", "Mis Compras","Mis Opiniones","Mis Listas"] }, //lo suyo seria recup.desde bd 
        children:[
                    { path: 'InicioPanel', element:<InicioPanel/>},
                      {path: 'MisCompras', element:<Compras/>},
                      {path: 'MisOpiniones', element:<Opinion/>},
                      {path: 'MisListas', element:<Listas/>},
                      {path: 'MisListas/:idLista', element:<Lista/>}

                  
        ]
      }       
    ]
);
 

function Appv2( ) {
        return (
                <ClienteLoggedProvider>
                    <ItemsCarroProvider>
                            <RouterProvider router={routerObjects} />
                    </ItemsCarroProvider>
                </ClienteLoggedProvider>
        );
}

export default Appv2;
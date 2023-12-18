import {useEffect, useState} from 'react';
import { useClienteLoggedContext } from '../../../App';
import clienteRESTService from '../../../servicios/restCliente';

function ModalDirecciones( {direccion,change} ) {
        //#region --------------- state manejado por el componente (global por context-api o local) ------------------
        const {clienteLogged}=useClienteLoggedContext();
        const [direcciones, setDirecciones]=useState(direccion ? direccion : {
            _id:'507f1f77bcf86cd799439011',
            calle:'',
            cp:'',
            pais:'',
            provincia:{
                CPRO:'',
                CCOM:'',
                PRO:''
            },
            municipio:{
                CPRO:'',
                CMUM:'',
                DMUN50:'',
                CUN:'0000000'
            },
            esPrincipal:true,
            esFacturacion:true
        });
        console.log('estado del componentes hijo direccion', direcciones)



        //#endregion

        //#region --------------- efectos del componente -------------------------------------------------------------
        useEffect(() => {
            setDirecciones(direccion ? direccion : {
              _id: '507f1f77bcf86cd799439011',
              calle: '',
              cp: '',
              pais: '',
              provincia: {
                CPRO: '',
                CCOM: '',
                PRO: ''
              },
              municipio: {
                CPRO: '',
                CMUM: '',
                DMUN50: '',
                CUN: '0000000'
              },
              esPrincipal: false,
              esFacturacion: false
            });
            console.log('state direccion renderizada ', direccion);
          }, [direccion]);

        useEffect(
                        //actualizar los datos del form con los datos del state
                        ()=>{
                            if(direccion){
                                document.getElementById('inputCalle').value=direccion.calle;
                                document.getElementById('inputCP').value=direccion.cp;
                                document.getElementById('inputPais').value=direccion.pais;
                                
                            }
                        },[direccion],
        );
        useEffect(

            ()=>{
                async function recuperarProvincias(){
                    let _provincias=await clienteRESTService.GetProvincias();
                    let _selectProvincias=document.querySelector('#inputProvincia');
                    _selectProvincias.innerHTML='';
                    
                    _provincias.data.forEach(
                        (prov)=>{
                            let _option=document.createElement('option');
                            _option.name=prov.PRO;
                            _option.value=prov.CPRO;
                            _option.textContent=prov.PRO;
                            prov.CPRO===direcciones.provincia.CPRO ? _option.selected=true : _option.selected=false;
                            _selectProvincias.appendChild(_option);
                        }
                    );
                    setDirecciones( {...direcciones, provincia: _provincias.data[0] } );
                }
                recuperarProvincias();
            },[direccion],


        );
        useEffect(
            ()=>{ 
                async function recuperarMunicipios(){
                    let _municipios=await clienteRESTService.GetMunicipios(direcciones.provincia.CPRO);
                    let _selectMunicipios=document.querySelector('#inputMunicipio');
                    _selectMunicipios.innerHTML='';
                    _municipios.data.forEach(
                        (mun)=>{
                            let _option=document.createElement('option');
                            _option.name=mun.DMUN50;
                            _option.value=mun.CMUM;
                            _option.textContent=mun.DMUN50;
                            mun.DMUN50===direcciones.municipio.DMUN50 ? _option.selected=true : _option.selected=false;
                            _selectMunicipios.appendChild(_option);
                        }
                    );
                }
                recuperarMunicipios();

            },[direcciones.provincia.CPRO]
        );    

        function HandleChange(event){
            let _calle = document.getElementById('inputCalle').value;
            let _cp = document.getElementById('inputCP').value;
            let _pais = document.getElementById('inputPais').value;
            let _provincia = document.getElementById('inputProvincia').value;
            let _municipio = document.getElementById('inputMunicipio').value;
            

                let _direccion={
                    _id:direcciones._id,
                    calle:_calle,
                    cp:_cp,
                    pais:_pais,
                    provincia:{
                        CPRO:_provincia,
                        CCOM:'',
                        PRO:''
                    },
                    municipio:{
                        CPRO:_provincia,
                        CMUM:_municipio,
                        DMUN50:'',
                        CUN:'0000000'
                    },
                    esPrincipal:false,
                    esFacturacion:false
                };
                setDirecciones(_direccion);
                console.log('state direccion actualizada: ', direcciones);
        }



        function HandleSubmit(ev){
            ev.preventDefault();
            //actualizar el state con la profincia y municipio seleccionados
            let _provincia = document.getElementById('inputProvincia').options[document.getElementById('inputProvincia').selectedIndex].text;
            let _municipio = document.getElementById('inputMunicipio').options[document.getElementById('inputMunicipio').selectedIndex].text;
            console.log('provincia: ', _provincia, ' municipio: ', _municipio);

            let _direccion=direcciones;
            _direccion.provincia.PRO=_provincia;
            _direccion.municipio.DMUN50=_municipio;
            setDirecciones(_direccion);

            console.log('direccion a actualizar: ', direcciones);
            
            async function actualizarDireccion(){
                let _res=await clienteRESTService.ActualizarDireccion({jwt:clienteLogged.jwt, direccion:direcciones});
                console.log('respuesta de actualizar direccion: ', _res);
            }
            actualizarDireccion();
            change(direcciones);
            setDirecciones(null)
        }

        //#endregion

        //#region --------------- funciones manejadoras de eventos ----------------------------------------------------
        //#endregion


        return (
                <div  className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Nueva Direccion</h5>
                        <button  type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <form onSubmit={HandleSubmit}>
                                <div className="row">
                                    <p>Si desea que enviemos el pedido a una dirección distinta de la de facturación, modifique los campos a </p>
                                    <p>continuación según proceda.</p>
                                </div>
                                <div className="row">
                                    
                                        <div className="col-12">
                                        <label htmlFor="inputCalle" className="form-label">Direccion de Envio:</label>
                                        <input type="text" className="form-control" id="inputCalle" placeholder="Mi Direccion" onChange={HandleChange}/>
                                        </div>

                                        <div className="col-6">
                                        <label htmlFor="inputCP" className="form-label">Codigo Postal:</label>
                                        <input type="text" className="form-control" id="inputCP" placeholder="Codigo Postal: 28803" onChange={HandleChange}/>
                                        </div>
                                        <div className="col-6">
                                        <label htmlFor="inputPais" className="form-label">Pais:</label>
                                        <input type="text" className="form-control" id="inputPais" placeholder="España" onChange={HandleChange}/>
                                        </div>
                                        
                                        
                                        <div className="col-6">
                                        <label htmlFor="inputProvincia" className="form-label">Provincia:</label>
                                        <select id="inputProvincia" className="form-select" onChange={HandleChange}>
                                            <option value="0" defaultValue={true}> - Seleccionar Provincia - </option>
                                        </select>
                                        </div>
                                        <div className="col-6">
                                        <label htmlFor="inputMunicipio" className="form-label">Municipio:</label>
                                        <select id="inputMunicipio" className="form-select" onChange={HandleChange}>
                                            <option value="0" defaultValue={true}> - Selecciona un Municipio -</option>
                                        </select>
                                        </div>

                                        <hr/>  
                                        <div className="col-12">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary" id="btnCrearDireccion"> Crear/Modificar direccion</button>
                                        </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
        );
}

export default ModalDirecciones;
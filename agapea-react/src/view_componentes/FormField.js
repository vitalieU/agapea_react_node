//este componente representa cualquier caja de tipo <input....
//se le deben pasar como propiedades:  type, id, label, name, placeholder, value, validators, onchangeinparent
// onchangeinparent es un puntero a la funcion del componente padre q quiero q se dispare ante un evento
//en el comp. hijo para modificar el valor del state en el comp.padre
import { useState } from "react";

function FormField({id,label,name,placeholder,type,value,onChangeInParent,validators}){
   //variable state interna del componente q se mapea contra un <input...
   //controla errores de validacion...se cambiara en el evento onBlur del input
    const [errorField, setErrorField]=useState('');

    function HandlerOnBlurEvent(ev){
        let {name,value}=ev.target;

        if (name === 'login' && value.trim()==='') return;

        let _validField=true;        
  
        Object.keys(validators).forEach(
          (validator)=>{
                        switch (validator) {
                          case 'required':
                                _validField=value.trim() !== '';
                            break;
  
                          case 'pattern':
                                _validField=new RegExp(validators[validator][0]).test(value);
                            break;
  
                          case 'minlength':
                                _validField=value.length >= validators[validator][0];
                            break;
  
                          case 'maxlength':
                                _validField=value.length < validators[validator][0];
                            break;
  
                          case 'compareto':
                            let _campoacomparar=validators[validator][0];
                            _validField=value === document.getElementsByName(_campoacomparar)[0].value;
                            break;
                            
                          default:
                            break;
                        }
                        
                        if (! _validField) {  setErrorField(validators[validator][1]) } else { setErrorField('') }
          }
        );

    }

    function HandlerChangeEvent(ev){
        let {name,value}=ev.target;
        onChangeInParent(name,value);
    }

    return (
      <div className="col-md-6">
            <label htmlFor={id} className="form-label">{label}:</label>                
            <input type={type} className="form-control" id={id} name={name} placeholder={placeholder} value={value} onChange={HandlerChangeEvent} onBlur={HandlerOnBlurEvent}></input>
            { errorField && <span className="text-danger">{errorField}</span>}
        </div>
    )

}

export default FormField;
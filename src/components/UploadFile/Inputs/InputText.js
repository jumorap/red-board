import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: "white",
    fontSize: "7px",
    textTransform: "capitalize",
  },
  container: {
    marginTop: "1em",
  },
}));

/** Componente que genera un label de seleccion multiple y con autocompletado de texto
 * @param {label } string  label que se mostrara para el input y lo marcara en la parte superior
 * @param {options} array[obj] arreglo con los obejetos que se van a mostrar en las opciones del input
 * @param {optionLabel} string valor del arreglo que contiene el label que se desea mostrar, ejemplo
 * [{materia: Ingesoft, codigo: dasodin21}, {materia: Ingesoft, codigo: dasodin21}], en este caso se
 * desea mostrar la materia por la tanto se debe pasar "materia" 
 * @param {setOption} React.setAction funcion que cambia el estado del state para almacenar el valor de ese textField
 * @param {errorState} bool identifica si hay algun error, de ser true indica que hay error, flase que no
 * @param {setError} React.setAction funcion que cambia el estado del error
 *
 * @returns
 */
const InputText = ({
  label,
  options,
  optionLabel = "",  
  defaultValue,  
  setOption,
  errorState,
  setError,
  disableInput,
}) => {
  const classes = useStyles();

  return (
    <Autocomplete
      disabled={disableInput}
      id={`combo-box-${String(optionLabel)}`}      
      options={options}
      defaultValue = {defaultValue}
      getOptionLabel={
        option => {
          if(optionLabel === ""){
            return option
          }
          return option[optionLabel]
        }        
      }
      style={{ width: "100%" }}                 
      renderInput={(params) => (
        <TextField
          className={classes.textField}          
          {...params}          
          error={errorState[label]}
          helperText={errorState[label] ? "Este campo no puede estar vacío" : ""}
          label={label}
          variant="outlined"
          disabled={disableInput}
        />
      )}
      className={classes.container}
      onChange={(event, newValue) => {        
        setOption({[label] : newValue})
        setError({[label] : false})
      }}      
      
    />
  );
};




export default InputText;

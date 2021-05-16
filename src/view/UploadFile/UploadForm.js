import React, { useState } from "react";
import "../css/uploadForm.css";
import { Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import MyDropzone from "./DropZone";
import InputText from "./InputText";
import { useMaterias, useProfesores } from "../ContextProvider";
import UploadedFile from "./UploadedFile";
import Archivos from "../../model/Archivos";
import CloseIcon from '@material-ui/icons/Close';

const materiasProv = [
  { title: "Ingnieria de software", ID: "19283y" },
  { title: "Arquitectura de software", ID: "19283y" },
  { title: "Ingnieria de software 2", ID: "19283y" },
  { title: "Ingnieria economica", ID: "19283y" },
  { title: "Ingnieria de gatos", ID: "19283y" },
  {
    title: "Introduccion a los estudios de genero y anatomicos de personas",
    ID: "19283y",
  },
];

const semestres = [
  { semestre: "2021-2" },
  { semestre: "2021-1" },
  { semestre: "2020-2" },
  { semestre: "2019-1" },
  { semestre: "2018-2" },
  { semestre: "2017-1" },
  { semestre: "2016-2" },
  { semestre: "2015-1" },
];

const categorias = [
  { categoria: "Parcial 1" },
  { categoria: "Parcial 2" },
  { categoria: "Parcial 3" },
  { categoria: "Parcial 4" },
  { categoria: "Parcial 5" },
  { categoria: "Parcial 7" },
  { categoria: "Parcial 8" },
  { categoria: "Parcial 9" },
  { categoria: "Taller 1" },
  { categoria: "Taller 2" },
  { categoria: "Taller 3" },
  { categoria: "Taller 4" },
  { categoria: "Taller 5" },
  { categoria: "Taller 6" },
  { categoria: "Taller 7" },
  { categoria: "Taller 8" },
];

const useStyles = makeStyles((theme) => ({
  uploadButton: {
    background: "#AA0000",
    "&:hover": {
      backgroundColor: "#800000",
    },
    color: "#FFF",
    borderRadius: 30,
    border: 0,
    padding: "5px 20px",
    width: "80%",
    marginTop: "20px"
  },
  closeButton: {
    position: "relative",
    left:"90%",
    top: "-20px",
  },

  leftDiv:{
    paddingRight: "10px",
    width: "50%",
    display: "flex",
    flexFlow: "column wrap",
    marginBlockEnd: "20px"
  },

  rightDiv:{
    paddingRight: "10px",
    width: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "15px"
  },

  sharemessage: {
    position: "relative",
    textAlign: "center",
    top: "20px",
    fontFamily: "inherit",
    fontSize: "20px",
  },
  
  descriptionBox: {
    marginTop: "13px",
    width: "105%",
    backgroundColor:"#fff"
  },

  warningDropText:{
    color: "#f44336",
    fontSize: "0.75rem"
  }
}));
const UploadForm = ({handleClose}) => {
  const materias = useMaterias();
  const profesores = useProfesores();

  const classes = useStyles();

  const [materiaText, setmateriaText] = useState("");
  const [profesorText, setProfesorText] = useState("");
  const [semestreText, setSemestreText] = useState("");
  const [categoriaText, setcategoriaText] = useState("");
  const [descripcionText, setDescripcionText] = useState("");
  const [file, setfile] = useState(null);

  const [materiaError, setmateriaError] = useState(false);
  const [profesorError, setProfesorError] = useState(false);
  const [semestreError, setSemestreError] = useState(false);
  const [categoriaError, setcategoriaError] = useState(false);
  const [fileError, setfileError] = useState(false);

  const handleChange = (event) => {
    setDescripcionText(event.target.value);
  };

  const handleSubmit = () => {
    
    let errors = false;

    if (materiaText === null || materiaText.length === 0) {
      setmateriaError(true);
      errors = true;
    }
    if (profesorText === null || profesorText.length === 0) {
      setProfesorError(true);
      errors = true;
    }
    if (semestreText === null || semestreText.length === 0) {
      setSemestreError(true);
      errors = true;
    }
    if (categoriaText === null || categoriaText.length === 0) {
      setcategoriaError(true);
      errors = true;
    }
    if (file === null) {
      alert("Ponga un arhcivo parce");
      setfileError(true);
      errors = true;
    }

    if (!errors) {
      Archivos.crearArchivos(
        materiaText.id,
        descripcionText,
        profesorText.profesor,
        semestreText.semestre,
        "usuario",
        categoriaText.categoria,
        file
      );
      handleClose()
    }
  };

  return (
  
    <div className="container">  
        <div className = {classes.sharemessage}>
          Compartir
        </div>
        <IconButton className = {classes.closeButton} onClick = {handleClose}>
          <CloseIcon/>
        </IconButton>

        <div className="upload_form">     
          <div className="subContainer"> 
            <div className={classes.leftDiv}>     
              <InputText
                label={"Materias"}
                options={materias}
                optionLabel={"materia"}
                setOption={setmateriaText}
                errorState={materiaError}
                setError={setmateriaError}
              />
              <InputText
                label={"Profesor"}
                options={profesores}
                optionLabel={"profesor"}
                setOption={setProfesorText}
                errorState={profesorError}
                setError={setProfesorError}
              />
              <InputText
                label={"Semestre"}
                options={semestres}
                optionLabel={"semestre"}
                setOption={setSemestreText}
                errorState={semestreError}
                setError={setSemestreError}
              />
              <InputText
                label={"Categoria"}
                options={categorias}
                optionLabel={"categoria"}
                setOption={setcategoriaText}
                errorState={categoriaError}
                setError={setcategoriaError}
              />
            </div>  
            <div className={classes.rightDiv}> 

            <div>
              {file === null ? (
                <MyDropzone setFile={setfile} />
              ) : (
                <UploadedFile file={file} setFile={setfile} />
              )}
              {fileError === true ? (<p
                className={classes.warningDropText}
              >Parce, coloque un archivo</p> ) : ("")}
            </div>

              <TextField
                id="outlined-multiline-static"
                label="Descripción"
                multiline
                rows={4}
                defaultValue=""
                variant="outlined"
                className={classes.descriptionBox}
                value={descripcionText}
                onChange={handleChange}
              />
            </div>
          </div>
            <Button
                  variant="contained"
                  className={classes.uploadButton}
                  onClick={handleSubmit}
                >
                  Compartir
                </Button>
        </div>
    </div>  
  );
};

export default UploadForm;

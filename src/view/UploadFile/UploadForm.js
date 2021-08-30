import React, { useState } from "react";
import "../css/uploadForm.css";
import { Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MyDropzone from "./DropZone";
import InputText from "./InputText";
import { useMaterias, useProfesores, useMateriaMap } from "../ContextProvider";
import UploadedFile from "./UploadedFile";
import Archivos from "../../model/Archivos";
import CloseIcon from "@material-ui/icons/Close";
import { firebaseAppAuth } from "../../model/firebaseSelf/firebaseConfig";
import CheckBoxZone from "./CheckBoxZone";


const useStyles = makeStyles(() => ({
  uploadButton: {
    background: "var(--redBoard)",
    "&:hover": {
      backgroundColor: "var(--hoverRedBoard)",
    },
    color: "#FFF",
    borderRadius: 30,
    border: 0,
    padding: "5px 20px",
    width: "80%",
    marginTop: "20px",
  },

  sharemessage: {
    position: "relative",
    textAlign: "center",
    top: "20px",
    fontFamily: "inherit",
    fontSize: "20px",
  },

  closeButton: {
    padding: 0,
  },

  descriptionBox: {
    width: "100%",
    backgroundColor: "white",
    marginTop: "15px",
  },

  warningDropText: {
    color: "#f44336",
    fontSize: "0.75rem",
  },
}));


//**Funcion que crea el formulario para subir el archivo con todos sus campos de texto*/
const UploadForm = ({ handleClose, fileToEdit }) => {
  let user = firebaseAppAuth.currentUser;

  const materias = useMaterias();
  const profesores = useProfesores();
  /**The conection with the provider to check the existence of the subject */
  const [materiaMap, setMateriaMap] = useMateriaMap();


  const [formToUploadActive, setFormToShare] = useState(false)

  const classes = useStyles();

  const [materiaText, setmateriaText] = useState("");
  const [profesorText, setProfesorText] = useState("");
  const [semestreText, setSemestreText] = useState("");
  const [categoriaText, setcategoriaText] = useState("");
  const [descripcionText, setDescripcionText] = useState("");
  const [file, setfile] = useState(null);
  const [grade, setgrade] = useState("") //text to save the grade if is necessary

  const [materiaError, setmateriaError] = useState(false);
  const [profesorError, setProfesorError] = useState(false);
  const [semestreError, setSemestreError] = useState(false);
  const [categoriaError, setcategoriaError] = useState(false);
  const [fileError, setfileError] = useState(false);
  const [gradeError, setgradeError] = useState(false)
  const [calificado, setCalificado] = useState(false)
  
  const handleChange = (event) => {
    setDescripcionText(event.target.value);
  };

  const handleSubmit = async () => {
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
      setfileError(true);
      errors = true;
    }
    if(gradeError){
      errors = true;
    }


    if (!errors) {
      setFormToShare(true)

    
    let nota = grade
    if(nota.length === 1){      
      nota += ".0" 
      setgrade(nota)
    }

      const newArchivo = await Archivos.crearArchivos(
        materiaText.id,
        descripcionText,
        profesorText,
        semestreText.semestre,
        user.uid,
        categoriaText.categoria,
        file,
        nota,
        calificado
      );
      
      materiaMap.add_archivo(newArchivo)
      handleClose();
    }
  };


  return (
    <div className="container">
      <div className={classes.sharemessage}>
        {fileToEdit ? "Editar" : "Compartir"}
      </div>
      <IconButton className={`${classes.closeButton} close-button`} onClick={handleClose}>
        <CloseIcon />
      </IconButton>

      <div className="upload-form">
        <div className="modal-sub-container">
          <div className="modal-left-div">
            <InputText
              label={"Materias"}
              options={materias}
              optionLabel={"materia"}
              defaultValue={materiaText}
              setOption={setmateriaText}
              errorState={materiaError}
              setError={setmateriaError}
              disableInput={formToUploadActive}
            />
            <InputText
              label={"Profesor"}
              options={profesores}
              optionLabel={""}
              defaultValue={profesorText}
              setOption={setProfesorText}
              errorState={profesorError}
              setError={setProfesorError}
              disableInput={formToUploadActive}
            />
            <div className="semetre-categoria">
              <InputText
                label={"Semestre"}
                options={semestres}
                optionLabel={"semestre"}
                defaultValue={semestreText}
                setOption={setSemestreText}
                errorState={semestreError}
                setError={setSemestreError}
                disableInput={formToUploadActive}
              />
              <InputText
                label={"Categoria"}
                options={categorias}
                optionLabel={"categoria"}
                defaultValue={categoriaText}
                setOption={setcategoriaText}
                errorState={categoriaError}
                setError={setcategoriaError}
                disableInput={formToUploadActive}
              />
            </div>
            <TextField
              id="outlined-multiline-static"
              label="Descripción (opcional)"
              multiline
              rows={4}
              variant="outlined"
              className={classes.descriptionBox}
              value={descripcionText}
              onChange={handleChange}
              disabled={formToUploadActive}
            />
          </div>
          <div className="modal-right-div">
            <p>
              Puedes comprimir tus PDF en&nbsp;
              <a href={"https://www.ilovepdf.com/compress_pdf"}
                 rel={"noreferrer"}
                 target={"_blank"}
                 style={{color: "#000", fontWeight: "bold",}}
              >
                ilovepdf.com
              </a>
            </p><br/>
            {file === null ? (
              <MyDropzone setFile={setfile} />
            ) : (
              <UploadedFile fileName={file.name} setFile={setfile} disabledButton={formToUploadActive}/>
            )}
            {fileError === true ? (
                <p className={classes.warningDropText}>
                  Por favor anexe un archivo
                </p>
            ) : (
                <></>
            )}
            
            {/* para colocar si esta resulto o no y la nota */}
            <CheckBoxZone 
              grade={grade}
              setgrade={setgrade}
              gradeError={gradeError}
              setgradeError={setgradeError}
              calificado={calificado}
              setCalificado={setCalificado}
              disabledChek={formToUploadActive}
            />

          </div>
        </div>
        <Button
          variant="contained"
          className={classes.uploadButton}
          onClick={handleSubmit}
          disabled={formToUploadActive}
        >
          {fileToEdit ? "Editar" : "Compartir"}
        </Button>
      </div>
    </div>
  );
};

export default UploadForm;

const semestres = [
  { semestre: "2021-2" },
  { semestre: "2021-1" },
  { semestre: "2020-2" },
  { semestre: "2019-1" },
  { semestre: "2018-2" },
  { semestre: "2017-1" },
  { semestre: "2016-2" },
  { semestre: "2016-1" },
  { semestre: "2015-2" },
  { semestre: "2015-1" },
  { semestre: "2014-2" },
  { semestre: "2014-1" },
  { semestre: "2013-2" },
  { semestre: "2013-1" },
];

const categorias = [
  { categoria: "Parcial" },
  { categoria: "Taller" },
  { categoria: "Quíz" },
  { categoria: "Laboratorio" },
  { categoria: "Guía" },
];

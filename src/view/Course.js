import React, { useState, useEffect } from "react";
import CourseFilter from "../components/CourseFilter";
import "../css/course.css";
import { CourseCards } from "../components/CourseCards";
import { FaBars, IoMdClose } from "react-icons/all";
import UploadFile from "../components/UploadFile/UploadFile";
import NavBar from "../components/SearchBar/NavBar";
import Materias from "../firebase/Materias";
import { useMateriaMap } from "../contextProvider/ContextProvider";
import { useHistory, useParams } from "react-router-dom";
import { getArrayFromObject, getFilterCategory, getFilteredFIles, initialMateriaValue } from "../contextProvider/ProgrammeResultsController";

function Course({ toggleUploadFileModal }) {

  /**The conection with the provider to check the existence of the subject */
  const [materiaMap, setmapMaterias] = useMateriaMap();

  /**The Id bring by the context that has the id of the materia to be displayed */
  const idCurrentMateria = useParams().idMateria;

  /* ----------- State hooks ----------- */
  /* const firstRender = useRef(true); */
  const [firstRender, setfirstRender] = useState(true);

  /* current materia (obj) */
  const [materiaValues, setMateriaValues] = useState(initialMateriaValue);

  /* File display modal status (mover modalss!!!!) */
  const [open, setOpen] = useState(false);

  /* Array with selected filters */
  const [selection, setSelection] = useState([]);

  // Use history for changing the current url with a fucntion
  const history = useHistory()
  

  /* ----------- Effect hooks ----------- */
  /* Asigna la materia actual al estado */
  useEffect(() => {
    /* si el map ya tiene la materia lo asigna a materiaValues */
    if (materiaMap.mapMaterias.has(idCurrentMateria)) {
      setMateriaValues(materiaMap.mapMaterias.get(idCurrentMateria));
    } else {
      /* si no busca la materia en la db y la asigna */
      fetchFiles();
    }
    setfirstRender(false);
    setSelection([]);
  }, [idCurrentMateria]);

  //when the Materia is featched form the DB, it updates the materiaMap context value
  useEffect(() => {    
    if (firstRender === false) {
      if (!materiaMap.mapMaterias.has(idCurrentMateria)) {
        materiaMap.mapMaterias.set(idCurrentMateria, { ...materiaValues });        
      }      
    }    
  }, [materiaValues]);

  useEffect(() => {
    if(firstRender === false){
      setMateriaValues(materiaMap.mapMaterias.get(idCurrentMateria));      
    }
  }, [materiaMap])

  
  /* Obtiene la materia de la db y la asigna a materiaValues (cambiar nombre a fetchMateria o fetchSubject) */
  let fetchFiles = () => {
    Materias._getFilesList(idCurrentMateria).then((value) => {
      if(value.exists === false){
        history.push("/")
        return
      }
      console.log(value.data())
      setMateriaValues({
        ...value.data(),
        trabajos: getArrayFromObject(value.data().trabajos),
      });

    });
  };
  
  
  let filteredFiles = getFilteredFIles(materiaValues, selection)

  /* Array of categories in curr materia (used in filters) */
  let categories = getFilterCategory(materiaValues, "tipos", "category")
  
  /* Array of profs in curr materia (used in filters) */
  let professors = getFilterCategory(materiaValues, "profesores", "prof")  

  /* Array of semesters in curr materia (used in filters) */
  let semesters = getFilterCategory(materiaValues, "semestres", "semester")
    

  /** Programme component, contains files and upper red bar (cambiar nombre? sacar?) */
  let programme = (properties, propertiesHamburger, redBar) => {
    return (
      <div className={`files-section ${properties}`}>
        <div className={`title-programme ${redBar}`}>
          {open ? (
            <IoMdClose
              className={propertiesHamburger}
              onClick={() => setOpen(!open)}
            />
          ) : (
            <FaBars
              className={propertiesHamburger}
              onClick={() => setOpen(!open)}
            />
          )}
          {materiaValues.nombre}
        </div>
        <div className={"for-each-programme"}>
          <CourseCards items={filteredFiles} toggleUploadFileModal = {toggleUploadFileModal}/>
        </div>
      </div>
    );
  };

  /** Function to render filters */
  let principalMenu = (title, items) => {
    return (
      <CourseFilter
        title={title}
        items={items}
        selection={selection}
        setSelection={setSelection}
        multiSelect
      />
    );
  };

  return (
    <div className={"general"}>
      <NavBar />
      {open ? (
        <div className={"principal-menu-bar principal-menu-bar-non-clicked"}>
          {principalMenu("Categoría", categories)}
          {principalMenu("Profesor", professors)}
          {principalMenu("Semestre", semesters)}
        </div>
      ) : (
        <div className={"principal-menu-bar hide-principal-menu-bar"} />
      )}
      {open
        ? programme(
          "files-section-non-clicked",
          "hamburger-menu hamburger-menu-clicked",
          "red-bar"
        )
        : programme("files-section-clicked", "hamburger-menu")}
      <UploadFile handleOpen={toggleUploadFileModal} />
    </div>
  );
}

export default Course;

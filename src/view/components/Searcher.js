import React, { useEffect, useRef, useState } from "react";
import SearchItem from "./SearchItem";
import "../css/searcher.css";
import { useFullTextSearch } from "../ContextProvider";
import {useHistory} from "react-router-dom"
//icons
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
//for detect clicks outside the componens
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


function Searcher() {
  /**Texto de la barra del buscador */
  const [searchText, setsearchText] = useState("");

  /**Usado para  mostrar las materias dado una busqueda*/
  const [searchResults, setsearchResults] = useState([]);

  const firstRender = useRef(true);  

  /**Traemos el full textSearch del context*/
  const searcherEngine = useFullTextSearch();

  /**Modifica el texto de input y los resultados que este arroja */
  const handleInputTextChange = (e) => {
    setsearchText(e.target.value);
  };

  //for redirect the current page
  const history = useHistory()

  // para poder navegar con las flechas por los resultados  
  const [currentResultIndex, setcurrentResultIndex] = useState(0)

  /**side effect que actualiza la searchResults cada vez que cambia la input */
  useEffect(() => {
    if (firstRender.current === true) {
      firstRender.current = false;
    } else {
      try{
        setsearchResults(searcherEngine.queryData(searchText).slice(0,5)) //slice is used to set the max possible result
        setcurrentResultIndex(0)
      }catch(e){
        setsearchResults([])
        setcurrentResultIndex(0)
        console.log(e)
      }
    }
  }, [searchText, searcherEngine]);

  /**activated when the close button is pressed */
  const handleCloseButton = () => {
    setsearchText("");
  };

  const handleKeyUp = (e) => {
    const keyPressed = e.key
    if(keyPressed === "Escape"){
      handleCloseButton()
      return
    }
    if(keyPressed === "Enter"){
      if(searchResults.length > 0){
        const idMateria =  searchResults[currentResultIndex].id
        history.push("/materias/" + idMateria)        
        handleCloseButton()
      }
      return
    }    
    
    if(searchResults.length === 0){
      return
    }
    
    if(keyPressed === "ArrowDown"){                  
      setcurrentResultIndex(Math.min(searchResults.length - 1 , currentResultIndex + 1))
      return
    }
    if(keyPressed === "ArrowUp"){            
      setcurrentResultIndex(Math.max(0, currentResultIndex - 1))
      return
    }
    console.log("hola")
    
  }

  useEffect(() => {
    console.log(currentResultIndex)
  }, [currentResultIndex])



  return (
    <ClickAwayListener onClickAway = {handleKeyUp}>
    
    <div className="searcher-container">
      <div className="searcher-container-input ">
        <input
          type="text"
          name="search"
          id="search"
          className="searcher-input"
          placeholder="Escribe el nombre de la materia"
          value={searchText}
          onChange={handleInputTextChange}
          autoComplete="off"                   
          onKeyUp = {handleKeyUp}   
        />
        <div className="faic">
          <IconButton
            onClick={handleCloseButton}
            style={{
              margin: 0,
              padding: 0,
              marginRight: "5px",
            }}
            aria-label="button delete search input"
          >
            <ClearIcon className="icon" aria-label="delete search input"/>
          </IconButton>
          <SearchIcon className="icon" aria-label="search icon"/>
        </div>
      </div>

      {/* Diplay search results */}
      {searchResults.map((val, index) => {        
        return  <SearchItem nombre={val.data} link={val.id} key={val.id} click = {handleCloseButton} selected = {index === currentResultIndex}/>
      })}
    </div>
    </ClickAwayListener>
  );
}

export default Searcher;

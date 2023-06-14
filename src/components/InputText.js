import React,{useState,useEffect, useContext} from 'react'
import { useNavigate } from "react-router-dom";
import TextContext from '../AppContext';

const InputText = (props) => {
  
  const {textData}=useContext(TextContext)
  const {addTextData}=useContext(TextContext)


  const handleSubmit = (e) => {
    e.preventDefault()
    fetch("http://127.0.0.1:5000/text_analysis_data",{
      method:"POST",
      // mode: 'cors',
      headers:{
        "Content_Type":"application/json",
        'Accept': 'application/json',
      },
      body:JSON.stringify({text,checkbox})
    }).then(response=>{
      response.json().then(json => {
        props.setData(json)
        
        
      });
    })
    
  }

  

  const [text,SetText]=useState("")
  const [checkbox, setCheckbox] = React.useState({
    espace: false,
    lower: false,
    contrac: false,
    swords: false
  });
  const labeldict={
    espace: "Remove extra white spaces",
    lower: "Change text to lower case",
    contrac: "Expand contractions",
    swords: "Remove stop words"
  }

  const handleChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      const temptext = e.target.result;
      console.log(temptext);
      SetText(temptext);
    }
    reader.readAsText(e.target.files[0]);
    
  }
  
  return (
    <div>

      <form onSubmit={handleSubmit} method="post">
        <label htmlFor="inputText">Enter text to analyse:</label>
        <input
            type="file"
            id="inputText" name="inputText"
            // value={text}
            onChange={handleChange}
         />
        
         <input type="submit" value="Analyze" name="btn"></input>
      </form>

      <p></p>
        
         
    </div>
  )
}

export default InputText
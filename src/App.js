import './App.css';
import InputText from './components/InputText'
import TextTable from './components/TextTable'
import DepTrees from './components/DepTrees'
import React,{useState,useEffect,useReducer} from 'react'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import {AppProvider} from "./AppContext";



function App() {
  // var data={}
  const [data, setData] = useState({})
  var dataDict=data
  console.log(data)
  return (
    <AppProvider>

    
      <div className="App">
      <InputText data = {data} setData = {setData}/>
      {'posText' in dataDict &&
      <TextTable data = {data} setData = {setData}/>
      }
      </div>
    
    </AppProvider>
    
  );
}

export default App;

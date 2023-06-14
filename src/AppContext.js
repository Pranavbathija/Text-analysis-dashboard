import { createContext,useState } from "react";

const TextContext=createContext();


export const AppProvider = ({children}) => {
    const [textData,setTextData]=useState([]);
    const addTextData=(tdata)=>{
        console.log(tdata)
        setTextData([tdata])
        // console.log(textData)
    }
  return (
    <TextContext.Provider value={{textData,addTextData}}>{children}</TextContext.Provider>
  )
}

export default TextContext

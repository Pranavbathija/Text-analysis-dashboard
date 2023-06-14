import React,{useState,useEffect, useContext} from 'react'
import { useLocation,useNavigate } from "react-router-dom";

const DepTrees = () => {
    const location = useLocation();
    console.log(location.state)
    const createDepTree = ()=> { 
        return {__html: location.state};
    }
  return (
    <div dangerouslySetInnerHTML={createDepTree()} ></div>
  )
}

export default DepTrees
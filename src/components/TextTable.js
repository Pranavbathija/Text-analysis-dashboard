import React,{useState,useEffect, useContext} from 'react'



const TextTable = (props) => {

  const taglist= [
    "ADJ",
    "ADP",
    "ADV",
    "AUX",
    "CONJ",
    "CCONJ",
    "DET",
    "INTJ",
    "NOUN",
    "NUM",
    "PART",
    "PRON",
    "PROPN",
    "PUNCT",
    "SCONJ",
    "SYM",
    "VERB",
    "X",
    "EOL",
    "SPACE",
  ]

  
    
      const labeldict={
        espace: "Remove extra white spaces",
        lower: "Change text to lower case",
        contrac: "Expand contractions",
        swords: "Remove stop words"
      }

      const handleToggle = ({ target }) =>{
        setCheckbox(s => ({ ...s, [target.name]: !s[target.name] }));
        
      }

      const handleSubmit = (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/text_analysis_data",{
          method:"POST",
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
    
    var dataDict=props.data
    console.log(dataDict)
    
    const [text,SetText]=useState(dataDict["orignalText"])
    const [checkbox, setCheckbox] = React.useState(dataDict["checkbox"]);
    
    var heading = ["textval","posText","nerText","keyText","polText","depHtml"];
    var body=[]
    var temp=[]
    
    if('posText' in dataDict){
      var higlightTags = function() {
        console.log(this.className)
        console.log(taglist.length)
        for (var i = 0; i < taglist.length; i++) {
          var ele = document.getElementsByClassName(taglist[i]+"_new");
          console.log(ele,taglist[i]);
          for (var j = 0; j < ele.length; j++) {
            ele[j].className = taglist[i]+"_hov";
          }
        }
        // var elements = document.getElementsByClassName(this.className+'_new');
        // for (var i in elements) {
        //     elements[i].className = this.className+"_hov";
        // }

        var elements = document.getElementsByClassName(this.className+'_hov');
        for (var i = 0; i < elements.length; i++) {
            elements[i].className = this.className+"_new";
        }
      
      };
      for (const tag of taglist) {
        var elements = document.getElementsByClassName(tag);
        console.log(elements)

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', higlightTags, false);
        }
      }
      
    var n=dataDict.posText.length
    for (let i = 0; i < n; i++) {
        temp=[]
        for (let  j= 0; j < heading.length; j++){
            temp.push(dataDict[heading[j]][i])
        }
        body.push(temp)
      }
    }
      console.log(dataDict.depHtml)

    return (
        
        <div>
        <div className='optionCheck'>
        <form onSubmit={handleSubmit} method="post">
        
        {Object.keys(checkbox).map(key => (
        <div>
        <label>
        <input
          type="checkbox"
          onChange={handleToggle}
          key={key}
          name={key}
          checked={checkbox[key]}
        />
        {labeldict[key]}
        </label><br></br>
        </div>
      ))}
         <input type="submit" value="Run" name="btn"></input>
      </form>
      </div>
      <div className='tableContainer'>
            <table className='texttable'>
            <thead>
                <tr>
                    {heading.map(head => <th>{head}</th>)}
                </tr>
            </thead>
            <tbody>
                {body.map((row) =>  <TableRow row={row} />)}
            </tbody>
        </table>
        </div>
      </div>
        
        
    );
}


const TableRow = (props) => {
  
  
  const tagcolors= {
    
    "ADJ": "red",
    "ADP": "green",
    "ADV": "pink",
    "AUX": "blue",
    "CONJ": "orange",
    "CCONJ": "yellow",
    "DET": "grey",
    "INTJ": "grey",
    "NOUN": "grey",
    "NUM": "grey",
    "PART": "grey",
    "PRON": "grey",
    "PROPN": "grey",
    "PUNCT": "grey",
    "SCONJ": "grey",
    "SYM": "grey",
    "VERB": "grey",
    "X": "grey",
    "EOL": "grey",
    "SPACE": "grey",
  }
  
    var htmlData=props.row[5]
    
    var row = props.row;
    
    var curr_row;
    
    curr_row=row.slice(0,-1).map(function(val,i){
      if(i==1){
        const currtags = val.split(" ");
        var postag=""
        currtags.forEach(element => {
          
          postag+="<mark class="+element+">"+element+"</mark>"+'&nbsp;';
        });
        
        return <td dangerouslySetInnerHTML={{ __html:postag}}/>
      
      }
      else if(i==0){
        const currtags = val.split(" ");
        const currpos=row[1].split(" ")
        var postag=""
        currtags.forEach((element,i) => {
          
          postag+="<mark class="+currpos[i]+"_hov>"+element+"</mark>"+'&nbsp;';
        });
        
        return <td dangerouslySetInnerHTML={{ __html:postag}}/>
      }
      else{
        return <td>{val}</td>
        }
      })
    return (
            <tr>
                {curr_row}
                
                <td>
                
                <div dangerouslySetInnerHTML={{ __html:htmlData}} ></div>
                </td>
            </tr>
            
      )
}

export default TextTable
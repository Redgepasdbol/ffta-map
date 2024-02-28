import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {updatePlanning} from "../../features/competitions"
import {updatePlanningPerso,loadPlanningJSON} from "../../features/planningPerso"

function JsonPopup({closeModal}) {
  const planningPerso = useSelector((state) => state.planningPerso);
  const [jsonInput, setJsonInput] = useState( JSON.stringify(planningPerso, null, 2));
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setJsonInput(event.target.value);
    //console.log(event.target.value)
  };

  const handleSubmit = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      //dispatch(updatePlanning(parsedJson));
      dispatch(loadPlanningJSON(parsedJson));      
      closeModal();
    } catch (error) {
      console.error('Erreur de parsing JSON:', error);
      // Gérer l'erreur de parsing JSON
    }
  };

  let runningAnimation = false
  function handleCopy  (e) {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if(!runningAnimation){
        runningAnimation=true
        e.target.textContent = "Copié !"
        setTimeout(()=> {
            e.target.textContent ="Copier"
            runningAnimation = false
        },1250)
      }
      navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2))
    } catch (error) {
      console.error('Erreur de parsing JSON:', error);
      // Gérer l'erreur de parsing JSON
    }
  };

  const closePopup = () => {
    // Logique pour fermer la popup
  };

  const planningJson = JSON.stringify(jsonInput, null, 2); // Indentation de 2 espaces pour une meilleure lisibilité

  function handleFileImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = handleFileChange;
    input.click();
  }
  
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(file);
  }
  
  function handleFileLoad(event) {
    try {
      const jsonContent = JSON.parse(event.target.result);
      //dispatch(loadPlanningJSON(jsonContent));
      setJsonInput(JSON.stringify(jsonContent, null, 2))
    } catch (error) {
      console.error("Erreur de chargement du fichier JSON :", error);
      // Gérer l'erreur de chargement JSON
    }
  }


  function handleExportJson() {
    const jsonContent = JSON.stringify(planningPerso, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "planningPerso.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  }
  
  

  return (
    <div className="absolute z-50 inset-0 bg-slate-800/75 flex items-center justify-center" onClick={closeModal}>
        <div className="bg-slate-300 text-slate-900 pt-10 px-5 rounded relative mb-[10vh]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-1 right-1 w-7 h-7 bg-red-600 border border-red-900 hover:bg-red-400 font-semibold text-slate-100 rounded flex justify-center items-center " onClick={closeModal}>X</button>
           
      <div  className="flex relative  float-left p-2">
      <button className="bg-blue-600 hover:bg-blue-400 font-semibold border border-blue-900 text-slate-100 p-1 rounded flex  justify-center items-center relative " onClick={handleCopy}>Copier</button>
      <button className="bg-blue-600 hover:bg-blue-400 font-semibold border border-blue-900 text-slate-100 p-1 rounded flex  justify-center items-center relative " onClick={handleFileImport}>Importer</button>
      <button className="bg-blue-600 hover:bg-blue-400 font-semibold border border-blue-900 text-slate-100 p-1 rounded flex  justify-center items-center relative " onClick={handleExportJson}>sauvegarder</button>

      
      </div> <div>
                <textarea 
        value={jsonInput}
        className="text-sm"
        onChange={handleInputChange}
        placeholder="Entrez votre JSON ici..."
        rows={20}
        cols={50}
      /></div>
      <div  className="flex relative  float-right p-2">

      <button
            className="bg-red-600 hover:bg-red-400 font-semibold border border-red-900 text-slate-100 p-1 rounded flex  justify-center items-center relative "
            onClick={()=> closeModal()}
          >
            Annuler
          </button>
      <button className="bg-green-600 hover:bg-green-400 font-semibold border border-green-900 text-slate-100 p-1 rounded flex  justify-center items-center relative " onClick={handleSubmit}>Valider</button>
      </div>
    </div>
    </div>
  );
}

export default JsonPopup;
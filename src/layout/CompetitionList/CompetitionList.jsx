//import React, { useEffect, useState, useRef } from "react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

//import React from "react";
//import { useDispatch, useSelector } from "react-redux";
//import { useCallback } from "react";
import "leaflet/dist/leaflet.css";
//import L from "leaflet";
//import competitions from "../../competitions_with_latlon.json";
//import competitions from "../../features/competitions";
//import filterProperties from "../../features/filterProperties";
//import { filter } from "../../features/competitions";
import { updateCurrentMarker } from "../../features/customMarker";
//import {planning} from "../../features/planning";
import {updatePlanning} from "../../features/competitions"
// Import styling


import img3D from "../../3D.png";
import imgNature from "../../nature.png";
import imgCampagne from "../../campagne.png";
import imgExterieur from "../../exterieur.png";
import img18m from "../../18m.jpg";
import imgLoisirs from "../../loisirs.png";
import imgPoussins from "../../poussins.png";
import imgNew from "../../new.png";
import imgUpdate from "../../update.png";
import JsonPopup from "../FilterPanel/JsonPopup";
import { updatePlanningPerso,addPlanningPerso,removePlanningPerso } from "../../features/planningPerso";
import { nanoid } from "@reduxjs/toolkit";
import { resetCompetition } from "../../features/customMarker";


export default function CompetitionList() {
  const dispatch = useDispatch();
  const competitionsList = useSelector((state) => state.competitions);
  // const markers = useSelector((state) => state.customMarker);
  const planningPerso = useSelector((state) => state.planningPerso);

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };


  useEffect(() => {
    dispatch(updatePlanningPerso(planningPerso))
  }, []);


  function mouseMoveOver(competitionId) {
    const competition = competitionsList.list.find(
      (o) => o.id === competitionId
    );
    if (competition.address.lat && competition.address.lon){
      dispatch(updateCurrentMarker(competition));
    }else{
      //console.log("nolat")
    }
  }

  function mouseMoveLeave() {
    dispatch(resetCompetition());
  }


  function handleAdd(e,idToAdd) {
    const getId = nanoid(10)
    const newCompetition = {
          id: `${getId}`,
          description: "les 2 jours",
          competitionId: `${idToAdd}`,
          dates: ["2024-06-22","2024-06-23"]
      }  
      
      if (!e.target.defaultChecked)
      { 
        dispatch(addPlanningPerso(newCompetition))
      }else{
        dispatch(removePlanningPerso(newCompetition))
        //console.log(planningPerso)
        //dispatch(updatePlanning(planningPerso));    
      }
  }

  const formatNumber = (number) => {
    return number < 10 ? "0" + number : number;
  };

  function getHours(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    const formattedHours = hours > 0 ? `${hours}h` : "";
    const formattedMinutes =
      remainingMinutes > 0 ? `${formatNumber(remainingMinutes)}min` : "";
    return (
      formattedHours +
      (formattedHours && formattedMinutes ? "" : "") +
      formattedMinutes
    );
  }

  function getTextDate(date) {
    const [year, month, day] = date.split("-");
    let startDate = new Date(year, month - 1, day); // Date de début de l'année
    return startDate.toLocaleDateString("fr-fr", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getImg(discipline) {
    switch (discipline) {
      case "Tir en campagne":
        return imgCampagne;
      case "Tir 3d":
        return img3D;
      case "Tir à l'arc extérieur":
        return imgExterieur;
      case "Tir nature":
        return imgNature;
      case "Tir à 18m":
        return img18m;
      case "Loisirs":
        return imgLoisirs;
      case "Tournoi poussin":
        return imgPoussins;
      default:
        return undefined;
    }
  }

  // function isOnPlanning(competition){
  //   const id = competition.id
  //   let found = false
  //   planning.selected.forEach((item) => {
  //     if (item.competitionId === id) {
  //       console.log(id + "-OK")
  //       found= true; 
  //     }  
  //   }) 
  //   return found ;
  // }

  return (
    <>
      <ul className="flex flex-col text-xs bg-slate-400 border border-black h-full w-full overflow-scroll">
        {competitionsList.list.map((item) => (
          <li
            key={item.detailLink}
            className="w-full pt-1 px-1 "
            competition={item.id} onMouseEnter={()=> mouseMoveOver(item.id)} onMouseLeave={()=> mouseMoveLeave()}
          >
            <div className="flex flex-row w-full">
              <div className="w-full " >
                <h3 className={"flex w-full text-slate-100 font-bold content-center   " + ( item.onPlanning ? " bg-green-800" : " bg-slate-700") } >
                  <span className="w-full inline-flex overflow-hidden" >
                  {
                    (item.status === "NEW" ? <img src={imgNew}     className=" align-middle w-4 h-4" alt="Missing" ></img> : "" )
                  }
                  {
                  (item.status === "UPDATED" ? <img src={imgUpdate} className="align-middle w-4 h-4" alt="Missing" ></img> : "" )
                  }      
                  <input
          className="ml-1 mt-1 h-4 bg-slate-400 checked:bg-red-500 after:bg-green-300 border-white "
          type="checkbox"
          defaultChecked={item.onPlanning}
          onChange={(e)=>handleAdd(e, item.id)} 
          // onChange={handleActivateInputs}
        />           
                  <a href={"https://www.ffta.fr/epreuve/" + item.detailLink} target="_blank" rel="noopener noreferrer"  
                  className={
                    "mx-1 w-full "                     
                  }
                  ><span   className="w-80 text-sm inline-block  overflow-hidden [text-transform:capitalize;]   whitespace-nowrap text-ellipsis"
                  
                  >


{/* { ( item.onPlanning ? "☑" : "☐")} */}
                    
                    
                    
                    
                   {item.title.toLowerCase()}</span></a>
                  </span>
                </h3>
                <h4 className={" text-slate-200 w-full text-left  overflow-hidden font-medium pl-1  inline-flex whitespace-nowrap  text-ellipsis" + ( item.onPlanning ? " bg-green-700" : " bg-slate-600") }>
                  {/* {item.discipline}  */}
                  <span className="inline-flex w-full">
                  {item.startDate === item.endDate
                    ? "Le " + getTextDate(item.startDate)
                    : "Du " +
                      getTextDate(item.startDate) +
                      " au " +
                      getTextDate(item.endDate)}
                      </span>
                      
                  
                
                </h4>
                <h4 className={" text-slate-200  w-full font-medium text-left pl-1 inline-flex" + ( item.onPlanning ? " bg-green-700" : " bg-slate-600") }>
                    {/* <span className="inline-flex bg-yellow-800 rounded-xl font-semibold border text-center hover:bg-yellow-500 hover:text-black ">                       */}
                    {/* <button className=" px-1 inline-flex bg-yellow-800 rounded-xl font-semibold border text-center hover:bg-yellow-500 hover:text-black text-slate-100  justify-center items-center " onClick={()=>handleAdd(item.id)}  >+</button> */}
                    {/* </span>  */}
              <span className="inline-flex w-full  whitespace-nowrap  text-ellipsis">
                  {getHours(item.address.duration)} -{" "}
                  {Math.round(item.address.distance)}km
                </span>
                
                 
                    

                {
                  (item.mandatLink.link ? 
                    <span className="inline-flex bg-blue-800 rounded-xl font-semibold border text-center hover:bg-blue-500 hover:text-black">
                      <a href={item.mandatLink.link} target="_blank" rel="noopener noreferrer" className="mx-2">Mandat</a>
                      </span> : "")
                  }
                
                  {
                  (item.resultsLink.link ? 
                    <span className="inline-flex bg-green-800 rounded-xl font-semibold border text-center  hover:bg-green-500 hover:text-black">
                  <a href={item.resultsLink.link} target="_blank" rel="noopener noreferrer" className="mx-2">Résultats</a> 
                  </span>: "")
                  }
               
                </h4>
              </div>
              {/* <div
                className="w-[32px] align-middle flex flex-col"                
              >
                 <img
                  src={getImg(item.discipline)}
                  competition={item.id}
                  onClick={handleInputs}
                  className=" align-middle  "
                  alt="Missing"
                ></img> 
                <div className="flex h-full"></div>
                <span className="flex  mx-1 text-2xl hover:brightness-125 cursor-pointer" competition={item.id} onClick={handleInputs}>🎯</span>              
              </div> */}
            </div>
          </li>
        ))}
      </ul>

    </>
  );
}

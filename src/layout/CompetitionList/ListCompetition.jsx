//import React, { useEffect, useState, useRef } from "react";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";

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
import { updatePlanning } from "../../features/competitions";
import { loadPlanning } from "../../features/planningPerso";
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
import {
  updatePlanningPerso,
  addPlanningPerso,
  removePlanningPerso,
} from "../../features/planningPerso";
import { nanoid } from "@reduxjs/toolkit";
import { resetCompetition } from "../../features/customMarker";
import { filter } from "../../features/competitions";
import ButtonAddCalendar from "./ButtonAddCalendar";
import Map2 from "../Map/Map2";
import PopupAddCalendar from "./PopupAddCalendar";

export default function ListCompetition() {
  const dispatch = useDispatch();
  const competitionsList = useSelector((state) => state.competitions);
  // const markers = useSelector((state) => state.customMarker);
  const planningPerso = useSelector((state) => state.planningPerso);
  const filters = useSelector((state) => state.filterProperties);
  const custMarker = useSelector((state) => state.customMarker);

  const [showPopup, setShowPopup] = useState(false);

  const [showModal, setShowModal] = useState({
    competition: {},
    status: false,
  });

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };


  function mouseMoveOver(competitionId) {
    const competition = competitionsList.list.find(
      (o) => o.id === competitionId
    );
    // console.log(competition)
    if (competition.address.lat && competition.address.lon){
      dispatch(updateCurrentMarker(competition));
    }else{
      //console.log("nolat")
      dispatch(resetCompetition());
    }
  }

  function mouseMoveLeave() {
    dispatch(resetCompetition());
  }
  useEffect(()=>{
    dispatch(loadPlanning())
  
  
},[])

  useEffect(()=>{
    dispatch(updatePlanning(planningPerso))
    dispatch(filter({ filters }));
    // console.log(filters)
  },[filters,planningPerso])



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
      weekday: "short",
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

  function callMe(id) {   
    competitionsList.list.forEach((item) => {
      if (item.id === id) {
        setShowModal({ competition: item, status: true });
        return;
      }
    });
  } 

  return (
    <>
      <div className="flex flex-row w-full border border-black  [font-family:Helvetica,Sans-Serif]">
        <div className="flex h-svh overflow-y-scroll min-w-[300px] max-w-[800px] w-1/2 bg-slate-400 ">
          <ul className="flex flex-col text-xs  h-full w-full  ">
            {competitionsList.list.map((item) => (
              <li
                key={item.detailLink}
                onMouseEnter={()=> mouseMoveOver(item.id)} onMouseLeave={()=> mouseMoveLeave()} 
                className="flex w-full p-[0px] px-[0px] mt-1 border-slate-800 border-[3px]  rounded-xl"
              >
                <div className="flex flex-row w-full ">
                  <div className="flew flex-col w-full ">
                    <h3
                      className={
                        "rounded-t-xl flex w-full text-slate-100 font-bold content-center  pl-1 " + (custMarker.current.competition === item ? " bg-green-700 " : " bg-slate-700 ")
                      }
                    >
                      <span className="w-full inline-flex overflow-hidden items-center  ">


                        <button
                          className={"flex  justify-center rounded-lg items-center w-[17px] h-[17px] p-[1px] mx-1  border-[2px] " + 
                          (planningPerso.selected.findIndex(itemPlanning => itemPlanning.competitionId === item.id) != -1 ? 
                          "bg-green-500 border-green-200 cursor-pointer hover:bg-green-700 hover:border-green-500 hover:text-green-300 ":
                          "bg-slate-500 border-slate-200 cursor-pointer hover:bg-slate-700 hover:border-slate-400  ")
                          }
                          onClick={() =>
                            setShowModal({ competition: item, status: true })
                          }
                        >
                          {
                            (planningPerso.selected.findIndex(itemPlanning => itemPlanning.competitionId === item.id) != -1 ? " ":" ")
                          }
                        </button>

                        {/* [filter:hue-rotate(120deg)]  */}
                        {/* <a
                          href={
                            "https://www.ffta.fr/epreuve/" + item.detailLink
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={"flex mx-1 w-full   "}
                        > */}
                          <span className=" text-sm inline-block  overflow-hidden [text-transform:capitalize;]  cursor-pointer whitespace-nowrap text-ellipsis"
                           competition={item.id}
                           onClick={()=>callMe(item.id)}
                           >
                            {item.title.toLowerCase()}
                          </span>
                        {/* </a> */}
                      </span>
                    </h3>
                    <h4
                      className={ 
                        "  w-full text-left  overflow-hidden font-medium pl-1  inline-flex whitespace-nowrap  text-ellipsis  " + (custMarker.current.competition === item ? " bg-green-600 text-green-200" : " bg-slate-500 text-slate-900")
                      }
                    >
                      {/* {item.discipline}  */}
                      <span className=" py-[1px]  inline-flex w-full font-bold">
                        {item.startDate === item.endDate
                          ? "Le " + getTextDate(item.startDate)
                          : "Du " +
                            getTextDate(item.startDate) +
                            " au " +
                            getTextDate(item.endDate)}
                      </span>
                    </h4>
                    <h4 className={"rounded-b-xl py-[1px] flex items-center justify-start" + (custMarker.current.competition === item ? " bg-green-400 text-green-800" : " bg-slate-400 text-slate-800")}>
                      <span className={"flex justify-start whitespace-nowrap w-full ml-1 font-bold"}>
                        {getHours(item.address.duration)} -{" "}
                        {Math.round(item.address.distance)}km
                      </span>

                      {item.mandatLink.link ? (
                        
                        <a href={
                          item.mandatLink.link
                        }
                        target="_blank"
                        rel="noopener noreferrer" className="inline-flex bg-yellow-800 rounded-xl text-slate-100 px-1 font-semibold border hover:border-slate-800 text-center hover:bg-yellow-500 hover:text-black cursor-pointer">
                          Mandat
                        </a>
                      ) : (
                        <span
                         className="inline-flex bg-slate-500 rounded-xl text-slate-100 line-through  font-light px-1  border text-center  cursor-not-allowed">
                        Mandat
                      </span>
                      )}

                      {item.resultsLink.link ? (
                        <a href={
                            item.resultsLink.link
                          }
                          target="_blank"
                          rel="noopener noreferrer" className="inline-flex bg-green-800 rounded-xl text-slate-100  px-1  font-semibold border hover:border-slate-800 text-center  hover:bg-green-500 hover:text-black cursor-pointer">
                          Résultats
                        </a>
                      ) : (
                        <span
                         className="inline-flex bg-slate-500 rounded-xl text-slate-100 line-through  font-light px-1  border text-center  cursor-not-allowed">
                        Résultats
                      </span>
                      )}

                      
                        <a href={
                            "https://www.ffta.fr/epreuve/" + item.detailLink
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                           className="inline-flex bg-blue-800 rounded-xl text-slate-100  px-1 font-semibold border hover:border-slate-800 text-center  hover:bg-blue-500 hover:text-black cursor-pointer">
                          ffta
                        </a>
                      
                      <span className="pr-3"></span>
                    </h4>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-full h-svh bg-pink-200 scree ">
          <Map2></Map2>
        </div>
      </div>
      {showModal.status &&
        createPortal(
          <PopupAddCalendar
            competition={showModal.competition}
            closeModal={() =>
              setShowModal({
                competition: showModal.competition,
                status: false,
              })
            }
          />,
          document.body
        )}
    </>
  );
}

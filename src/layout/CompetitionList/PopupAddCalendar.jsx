import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePlanning } from "../../features/competitions";
import {
  updatePlanningPerso,
  addPlanningPerso,
  removePlanningPerso,
} from "../../features/planningPerso";
import { nanoid } from "@reduxjs/toolkit";

function PopupAddCalendar({ competition, closeModal }) {
  const planningPerso = useSelector((state) => state.planningPerso);
  const [currentCompetition, setCurrentCompetition] = useState({
    id: nanoid(10),
    description: "",
    competitionId: "",
    dates: [],
  });

  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(planningPerso, null, 2)
  );
  const dispatch = useDispatch();


  useEffect(() => {
    
    const getCompetition = {
      id: nanoid(10),
      description: "",
      competitionId: competition.id,
      dates: [],
    };
    planningPerso.selected.forEach((item) => {
      if (item.competitionId === competition.id) {
        getCompetition.id = item.id;
        getCompetition.description = item.description;
        getCompetition.dates = item.dates;
        return;
      }
    });
    //console.log(getCompetition)
    setCurrentCompetition(getCompetition);
  }, []);



  let runningAnimation = false;
  function handleCopy(e) {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!runningAnimation) {
        runningAnimation = true;
        e.target.textContent = "Copié !";
        setTimeout(() => {
          e.target.textContent = "Copier";
          runningAnimation = false;
        }, 1250);
      }
      navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2));
    } catch (error) {
      console.error("Erreur de parsing JSON:", error);
      // Gérer l'erreur de parsing JSON
    }
  }

  function handleUpdate(e) {}

  const closePopup = () => {
    // Logique pour fermer la popup
  };

  const planningJson = JSON.stringify(jsonInput, null, 2); // Indentation de 2 espaces pour une meilleure lisibilité

  function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    return dates;
  }

  function getTextDate(date) {
    const [year, month, day] = date.split("-");
    let startDate = new Date(year, month - 1, day); // Date de début de l'année
    return startDate.toLocaleDateString("fr-fr", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
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

  function handleCheckboxChange(date) {
    
    if (currentCompetition.dates.includes(date)) {
      setCurrentCompetition(prevState => ({
        ...prevState,
        dates: prevState.dates.filter(d => d !== date)
      }));
    } else {
      setCurrentCompetition(prevState => ({
        ...prevState,
        dates: [...prevState.dates, date]
      }));
    }

  }

  function handleInputChange (event)  {
    const value = event.target.value;
    setCurrentCompetition(prevState => ({
      ...prevState,
      description: value
    }));
  };


  function handleSubmit  ()  {
    try {
      dispatch(updatePlanningPerso(currentCompetition));
      
      closeModal();
    } catch (error) {
      console.error("Erreur de parsing JSON:", error);
      // Gérer l'erreur de parsing JSON
    }
  };



  
  return (
    <div
      className="absolute z-50 inset-0 bg-slate-800/75 flex items-center justify-center"
      onClick={closeModal}
    >
      <div
        className="bg-slate-300 text-slate-900 pt-10 px-5 rounded relative mb-[10vh]"
        onClick={(e) => e.stopPropagation()}
      >

        
        <button
          className="absolute top-1 right-1 w-7 h-7 bg-red-600 border border-red-900 hover:bg-red-400 font-semibold text-slate-100 rounded flex justify-center items-center "
          onClick={closeModal}
        >
          X
        </button>

        <div className="flew flex-col">
          <span className="flex text-2xl font-semibold">
            {competition.title} 
          </span>
          <span className="flex text-xl">
            {competition.discipline} - {competition.type}
          </span>
          <span className="flex ">
            {competition.address.address}
          </span>
          <span className="flex">
            {getHours(competition.address.duration)} -{" "}
            {Math.round(competition.address.distance)}km
          </span>
          <hr className="flex  my-2"></hr>
          {/* <span className="flex">{competition.location}</span> */}
          {/* <span className="flex">{competition.startDate}</span>
          <span className="flex">{competition.endDate}</span> */}
          {/* <span className="flex">{competition.mandatLink.link}</span>
          <span className="flex">{competition.resultsLink.link}</span> */}

          <div className="flex w-full">

          {competition.mandatLink.link ? (
                        
            <a href={
              competition.mandatLink.link
            }
            target="_blank"
            rel="noopener noreferrer" 
            className="bg-yellow-600 hover:bg-yellow-400 font-semibold border border-yellow-900 text-slate-100 p-1 rounded flex w-full justify-center items-center relative "
            >
              Mandat
            </a>
          ) : (
            <span
            className="bg-slate-600 line-through font-semibold border border-slate-900 text-slate-400 p-1 rounded flex w-full justify-center items-center relative "
              >
              Mandat
            </span>
          )}

          {competition.resultsLink.link ? (
            <a href={
              competition.resultsLink.link
              }
              target="_blank"
              rel="noopener noreferrer" 
              className="bg-green-600 hover:bg-green-400 font-semibold border border-green-900 text-slate-100 p-1 rounded flex w-full justify-center items-center relative "
              >
              Résultats
            </a>
          ) : (
            <span
            className="bg-slate-600 font  line-through font-semibold border border-slate-900 text-slate-400 p-1 rounded flex w-full justify-center items-center relative "
              >
              Résultats
            </span>
          )}

          
            <a href={
                "https://www.ffta.fr/epreuve/" + competition.detailLink
              }
              target="_blank"
              rel="noopener noreferrer" 
              className="bg-blue-600 hover:bg-blue-400 font-semibold border border-blue-900 text-slate-100 p-1 rounded flex w-full justify-center items-center relative "
              >
              ffta
            </a>
          </div>
          
            <hr className="flex  my-2"></hr>
          
          {/* <span className="flex">{competition.creationDate}</span>
          <span className="flex">{competition.lastUpdateDate}</span> */}
        </div>
        <div className="flex flex-row h-full w-[500px] overflow-scroll">
          {getDatesInRange(competition.startDate, competition.endDate).map(
            (item) => (
              <div key={nanoid(20)} className="inline-block cursor-pointer whitespace-nowrap  border border-slate-800 p-1 content-center items-center "
              date={item} onClick={() => handleCheckboxChange(item)}>
                <input type="checkbox"  date={item} defaultChecked={currentCompetition.dates.includes(item)}                 
                className="inline-block h-5 w-5 mr-1 "></input>
                {getTextDate(item)}
              </div>
            )
          )}
        </div>
        <div className="flex pt-1 ">
          <textarea
            //defaultValue={currentCompetition.description}
            value={currentCompetition.description}
            className="text-sm w-full rounded p-2"
            onChange={handleInputChange}
            autoFocus={true}
            placeholder="Entrez votre commentaire ici..."
            rows={20}
            cols={50}
          />
        </div>
        <div className="flex relative  float-right p-2">
          <button
            className="bg-red-600 hover:bg-red-400 font-semibold border border-red-900 text-slate-100 p-1 rounded flex  justify-center items-center relative "
            onClick={()=> closeModal()}
          >
            Annuler
          </button>
          <button
            className="bg-green-600 hover:bg-green-400 font-semibold border border-green-900 text-slate-100 p-1 rounded flex  justify-center items-center relative "
            onClick={handleSubmit}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupAddCalendar;

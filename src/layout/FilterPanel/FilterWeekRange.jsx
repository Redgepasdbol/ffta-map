import { useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

import { updateWeekValue,updateBoxWeek } from "../../features/filterProperties";

export default function FilterWeekRange({ inputData }) {
  const dispatch = useDispatch();

  function handleInputDate(e) {
    updateWeek(e.target.value);
  }

  function updateWeek(index) {
    const weeksOfYear = getWeeksOfYear();
    if (index >= 0 && index <=  weeksOfYear.length - 1){
      setSelectedWeekIndex(index);
      dispatch(
        updateWeekValue({
          inputNumber: inputData.inputNumber,
          startDate: reverseDateString(formatDate(weeksOfYear[index].start)),
          endDate: reverseDateString(formatDate(weeksOfYear[index].end)),
        })
        );
      }
  }

  function handleActivateInputs(e) {
    dispatch(
      updateBoxWeek({
        inputNumber: inputData.inputNumber,
        enabled: !e.target.defaultChecked,
      })
    );
  }

  function handleNextWeek(e) {
    updateWeek(selectedWeekIndex * 1 + 1);
  }
  function handlePreviousWeek(e) {
    updateWeek(selectedWeekIndex - 1);
  }
  function handleCurrentWeek(e) {
    updateWeek(currentWeekIndex);
  }

  const getWeeksOfYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const weeks = [];

    let startDate = new Date(currentYear, 0, 1); // Date de début de l'année

    while (startDate.getDay() !== 1) {
      // Recherche du premier lundi de l'année
      startDate.setDate(startDate.getDate() + 1);
    }

    while (startDate.getFullYear() === currentYear) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6); // Date de fin de la semaine

      const week = {
        start: new Date(startDate),
        end: new Date(endDate),
      };
      weeks.push(week);

      startDate.setDate(startDate.getDate() + 7); // Passer à la semaine suivante
    }

    return weeks;
  };

  //console.log(getWeeksOfYear());

  // Fonction pour formater une date au format "dd/mm/yyyy"
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const reverseDateString = (dateString) => {
    //console.log(dateString);
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  //const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const weeksOfYear = getWeeksOfYear();

    //setWeeks(weeksOfYear);

    const currentWeekIndex = weeksOfYear.findIndex((week) => {
      const currentDate = new Date();
      return currentDate >= week.start && currentDate <= week.end;
    });
    setSelectedWeekIndex(currentWeekIndex);
    setCurrentWeekIndex(currentWeekIndex);
    updateWeek(currentWeekIndex);
    // setCurrentWeekIndex(currentWeekIndex);
    // dispatch(
    //   updateWeekValue({
    //     inputNumber: inputData.inputNumber,
    //     startDate: reverseDateString(formatDate(weeksOfYear[currentWeekIndex].start)),
    //     endDate: reverseDateString(formatDate(weeksOfYear[currentWeekIndex].end)),
    //   })
    // );
  }, []);

  return (
    <div className="my-4 w-44 text-sm ">
      <div className="flex flex-row bg-indigo-200">
      <input
          className="flex mt-1  "
          type="checkbox"
           defaultChecked={inputData.enabled}
           onChange={handleActivateInputs}
        />
        <span className="flex ml-1 w-44 ">Semaine</span>        
         {/* <input
          onChange={handleInputs}
          value={inputData.value}
          step={inputData.step}
          className="flex w-20 h-6  border-gray-200 text-right text-sm"
          type="number"
        />          */}
      </div>

      <div className={inputData.enabled ? "w-full content-center text-center mt-1" : "hidden"} >      
        <button
          className=" border border-slate-800 bg-slate-100 cursor-pointer w-min p-1 font-semibold hover:bg-slate-600 hover:text-slate-100"
          onClick={handlePreviousWeek}
        >
          &lt;&lt;
        </button>
        <button
          className=" border border-slate-800 bg-slate-100 cursor-pointer w-auto p-1 font-semibold hover:bg-slate-600 hover:text-slate-100"
          onClick={handleCurrentWeek}
        >
          Cette semaine
        </button>
        <button
          className=" border border-slate-800 bg-slate-100 cursor-pointer w-min p-1 font-semibold hover:bg-slate-600 hover:text-slate-100"
          onClick={handleNextWeek}
        >
          &gt;&gt;
        </button>
      </div>
      <div className={inputData.enabled ? "w-full" : "hidden"} >   
        <select
          className="w-full text-xs p-1"
          onChange={handleInputDate}
          value={selectedWeekIndex}
        >
          {getWeeksOfYear().map((o, index) => (
            <option
              key={`${formatDate(o.start)}`}
              value={index}
              //selected={index === currentWeekIndex}
            >
              {`${formatDate(o.start)} - ${formatDate(o.end)}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

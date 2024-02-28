import { useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { updateWeekValue } from "../../features/filterProperties";

// export default function FilterWeek({ inputData }) {
export default function FilterDatesaa({}) {
  const dispatch = useDispatch();

  const [currentMode, setCurrentMode] = useState("week");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  

  useEffect(() => {
    if(currentMode === "week"){
      const weeksOfYear = getWeeksOfYear();
      const currentWeekIndex = weeksOfYear.findIndex((week) => {
        const currentDate = new Date();
        return currentDate >= week.start && currentDate <= week.end;
      });
      setSelectedWeekIndex(currentWeekIndex);
      setCurrentWeekIndex(currentWeekIndex);
      updateWeek(currentWeekIndex);
    }else{

    }    
  }, []);


  function handleInputDate(e) {
    updateWeek(e.target.value);
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

  function updateWeek(index) {
    const weeksOfYear = getWeeksOfYear();
    if (index >= 0 && index <= weeksOfYear.length - 1) {
       setSelectedWeekIndex(index);
      dispatch(
        updateWeekValue({
          inputNumber: 4,
          startDate: reverseDateString(formatDate(weeksOfYear[index].start)),
          endDate: reverseDateString(formatDate(weeksOfYear[index].end)),
        })
        );
    }
  }

  function updateMonth(index) {
    const monthsOfYear = getMonthsOfYear();
    if (index >= 0 && index <= 12) {
      setSelectedWeekIndex(index);
      dispatch(
        updateWeekValue({
          inputNumber: 4,
          startDate: reverseDateString(formatDate(monthsOfYear[index].start)),
          endDate: reverseDateString(formatDate(monthsOfYear[index].end)),
        })
        );
    }
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



  return (
    <div className="flex w-full min-w-[200px] ">
      <div className="flex  ">
        <button
          onClick={handlePreviousWeek}
          className="hover:text-opacity-80  flex border border-slate-800 bg-slate-100 cursor-pointer w-min text-xl p-[3px]  font-semibold hover:bg-slate-600 hover:text-slate-100 rounded"
        >
          ⏪
        </button>
        <select
          className="rounded border-black border hover:text-opacity-80 flex w-min text-xs p-1 appearance-none  [background:#828d92] hover:[background:929da2] text-slate-100 font-sm font-bold  "
          //value={selectedWeekIndex}
          //onChange={handleInputDate}
        >
          <option key="001" className="bg-green-700">Toutes</option>
          <option key="002" className="bg-pink-600">Mois</option>
          <option key="003" className="bg-pink-600">Sem.</option>
        </select>
        <select
          className="rounded border-black border hover:text-opacity-80 flex w-full text-xs p-1 appearance-none  [background:#828d92] hover:[background:929da2] text-slate-100 font-sm font-bold  "
           value={selectedWeekIndex}
           onChange={handleInputDate}
        >
          {/* <option key="001" className="bg-green-700">Toutes</option>
          <option key="002" className="bg-pink-600">Janvier 2024</option>
          <option key="003" className="bg-pink-600">Février 202</option>
          <option key="004" className="bg-pink-600">Mars 2024</option>
          <option key="005" className="bg-pink-600">Avril 2024</option>
          <option key="006" className="bg-pink-600">Mai 2024</option>
          <option key="007" className="bg-pink-600">Juin 2024</option>
          <option key="008" className="bg-pink-600">Juillet 2024</option>
          <option key="0069" className="bg-pink-600">Août 2024</option>
          <option key="0061" className="bg-pink-600">Septembre 2024</option>
          <option key="0062" className="bg-pink-600">Octobre 2024</option>
          <option key="0063" className="bg-pink-600">Novembre 2024</option>
          <option key="0064" className="bg-pink-600">Décembre 2024</option> */}

          {
          

          
          getWeeksOfYear().map((o, index) => (
            <option key={`${formatDate(o.start)}`} value={index} className={(index===currentWeekIndex ? "bg-green-700":"")}>
              {`${formatDate(o.start)} - ${formatDate(o.end)}`}
            </option>
          ))
          
          }

        </select>
        <button
          onClick={handleNextWeek}
          className="rounded hover:text-opacity-80 flex border border-slate-800 bg-slate-100 cursor-pointer w-min text-xl p-[3px] font-semibold hover:bg-slate-600 hover:text-slate-100"
        >
          ⏩
        </button>
      </div>
    </div>
  );
}

import { useDispatch } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { updateWeekValue } from "../../features/filterProperties";

// export default function FilterWeek({ inputData }) {
export default function FilterDates({}) {
  const dispatch = useDispatch();

  const [currentMode, setCurrentMode] = useState("month");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  function initLists(mode) {
    setCurrentMode(mode);
    const currentDate = new Date();
    switch (mode) {
      case "week":
        const weeksOfYear = getWeeksOfYear();
        const currentWeekIndex = weeksOfYear.findIndex((week) => {
          return currentDate >= week.start && currentDate <= week.end;
        });
        setSelectedIndex(currentWeekIndex);
        setCurrentWeekIndex(currentWeekIndex);
        updateDate(mode,currentWeekIndex);        
        break;
      case "month":
        const monthsOfYear = getMonthsOfYear();
        const currentMonthIndex = monthsOfYear.findIndex((month) => {
          return currentDate >= month.start && currentDate <= month.end;
        });

        setSelectedIndex(currentMonthIndex);
        setCurrentMonthIndex(currentMonthIndex);
        updateDate(mode,currentMonthIndex);        
        break;
      case "all":
        setSelectedIndex(0);
        setCurrentMonthIndex(0);
        updateDate(mode,0);
        break;
      default:
      //console.log("missing mode");
    }
    
  }

  useEffect(() => {
    initLists("week");
  }, []);

  function handleInputDate(e) {
     updateDate(currentMode,e.target.value);
  }

  function handleInputMode(e) {
    //setCurrentMode(e.target.value);
    initLists(e.target.value);
  }

  function handleNext(e) {
     updateDate(currentMode,selectedIndex * 1 + 1);
  }
  function handlePrevious(e) {
     updateDate(currentMode,selectedIndex - 1);
  }
  // function handleCurrent(e) {
  //   updateWeek(currentWeekIndex);
  // }

  function updateDate(mode,index) {
    //console.log(currentMode);
    switch (mode) {
      case "week":
        const weeksOfYear = getWeeksOfYear();
        if (index >= 0 && index <= weeksOfYear.length - 1) {
          setSelectedIndex(index);
          dispatch(
            updateWeekValue({
              inputNumber: 4,
              startDate: reverseDateString(
                formatDate(weeksOfYear[index].start)
              ),
              endDate: reverseDateString(formatDate(weeksOfYear[index].end)),
            })
          );
        }
        break;
      case "month":
        const monthsOfYear = getMonthsOfYear();
        if (index >= 0 && index <= monthsOfYear.length - 1) {
          setSelectedIndex(index);
          dispatch(
            updateWeekValue({
              inputNumber: 4,
              startDate: reverseDateString(
                formatDate(monthsOfYear[index].start)
              ),
              endDate: reverseDateString(formatDate(monthsOfYear[index].end)),
            })
          );
        }
        break;
      // statements
      // …
      default:
        setSelectedIndex(index);
        dispatch(
          updateWeekValue({
            inputNumber: 4,
            startDate: reverseDateString("01/01/2024"),
            endDate: reverseDateString("31/12/2024"),
          })
        );
      //console.log("missing mode");
    }
  }

  // function updateMonth(index) {
  //   const monthsOfYear = getMonthsOfYear();
  //   if (index >= 0 && index <= 12) {
  //     setSelectedIndex(index);
  //     dispatch(
  //       updateWeekValue({
  //         inputNumber: 4,
  //         startDate: reverseDateString(formatDate(monthsOfYear[index].start)),
  //         endDate: reverseDateString(formatDate(monthsOfYear[index].end)),
  //       })
  //     );
  //   }
  // }

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

  const getMonthsOfYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const months = [];

    let monthIndex = 0;
    while (monthIndex < 12) {
      const startOfMonth = new Date(currentYear, monthIndex, 1);
      const endOfMonth = new Date(currentYear, monthIndex + 1, 0);

      const month = {
        start: new Date(startOfMonth),
        end: new Date(endOfMonth),
        name: startOfMonth.toLocaleString("default", { month: "long" }), // Obtenir le nom du mois
      };
      months.push(month);

      monthIndex++;
    }

    return months;
  };

  // Fonction pour formater une date au format "dd/mm/yyyy"
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatMonth = (date) => {
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
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
          onClick={handlePrevious}
          className="hover:text-opacity-80  flex border border-slate-800 bg-slate-100 cursor-pointer w-min text-xl p-[3px]  font-semibold hover:bg-slate-600 hover:text-slate-100 rounded"
        >
          ⏪
        </button>
        <select
          className="rounded border-black border hover:text-opacity-80 flex w-min text-xs p-1 appearance-none  [background:#828d92] hover:[background:929da2] text-slate-100 font-sm font-bold  "
          value={currentMode}
          onChange={handleInputMode}
        >
          <option key="001"  value="all">
            Toutes
          </option>
          <option key="002"  value="month">
            Mois
          </option>
          <option key="003"  value="week">
            Sem.
          </option>
        </select>
        <select
          className="rounded border-black border hover:text-opacity-80 flex w-full text-xs p-1 appearance-none  [background:#828d92] hover:[background:929da2] text-slate-100 font-sm font-bold  "
          value={selectedIndex}
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

          {currentMode === "week" ? (
            getWeeksOfYear().map((o, index) => (
              <option
                key={`${formatDate(o.start)}`}
                value={index}
                className={index === currentWeekIndex ? "bg-green-700" : ""}
              >
                {`${formatDate(o.start)} - ${formatDate(o.end)}`}
              </option>
            ))
          ) : currentMode === "month" ? (
            getMonthsOfYear().map((o, index) => (
              <option
                key={`${formatDate(o.start)}`}
                value={index}
                className={index === currentMonthIndex ? "bg-green-700" : ""}
              >
                {`${formatMonth(o.start)}`}
              </option>
            ))
          ) : (
            <option key="1" value="0">
              -----------------------
            </option>
          )}
        </select>
        <button
          onClick={handleNext}
          className="rounded hover:text-opacity-80 flex border border-slate-800 bg-slate-100 cursor-pointer w-min text-xl p-[3px] font-semibold hover:bg-slate-600 hover:text-slate-100"
        >
          ⏩
        </button>
      </div>
    </div>
  );
}

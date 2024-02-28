import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import PopupAddCalendar from "./PopupAddCalendar";
// import FilterRange from "./FilterRange";
// import FilterListbox from "./FilterListbox";
//import FilterDate from "./FilterDate";
//import FilterDateRange from "./FilterDateRange";
// import FilterWeekRange from "./FilterWeekRange";
// import FilterStatus from "./FilterStatus";
// import { updatePlanning } from "../../features/competitions";

export default function ButtonAddCalendar(data) {
  const planningPerso = useSelector((state) => state.planningPerso);
  const [showModal, setShowModal] = useState({
    competition: data.competition,
    status: false,
  });

  return (
    <>        
      <button
        className={"flex  justify-center items-center w-[17px] h-[17px] p-[7px] ml-1 border-[2px] " + 
        (planningPerso.selected.findIndex(item => item.competitionId === data.competition.id) != -1 ? 
        "bg-red-500 border-red-200 cursor-pointer hover:bg-red-700 hover:border-red-500 hover:text-red-300 ":
        "bg-slate-500 border-slate-200 cursor-pointer hover:bg-slate-700 hover:border-slate-400  ")
        }
        onClick={() =>
          setShowModal({ competition: data.competition, status: true })
        }
      >
        {
          (planningPerso.selected.findIndex(item => item.competitionId === data.competition.id) != -1 ? "X":"")
        }
      </button>
      {showModal.status &&
        createPortal(
          <PopupAddCalendar
            competition={data.competition}
            closeModal={() =>
              setShowModal({ competition: data.competition, status: false })
            }
          />,
          document.body
        )}
    </>
  );
}

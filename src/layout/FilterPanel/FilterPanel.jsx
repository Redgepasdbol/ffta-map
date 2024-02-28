import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from "react-dom";
import FilterRange from "./FilterRange";
import FilterListbox from "./FilterListbox";
//import FilterDate from "./FilterDate";
//import FilterDateRange from "./FilterDateRange";
import FilterWeekRange from "./FilterWeekRange";
import FilterStatus from "./FilterStatus";
import JsonPopup  from "./JsonPopup";
import { updatePlanning } from "../../features/competitions";

export default function FilterPanel() {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.filterProperties);
  const [showModal,setShowModal] = useState(false)
  const planningPerso = useSelector((state) => state.planningPerso);

  useEffect(() => {
    dispatch(updatePlanning(planningPerso));
    //console.log("LOAD")
  }, []);

  const filterInputs = filterState.map((input, index) => {
    if (input.type === "range") {
      return <FilterRange key={index} inputData={input} />;
    }
    if (input.type === "select") {
      return <FilterListbox key={index} inputData={input} />;
    }
    // if (input.type === "date") {
    //   return <FilterDate key={index} inputData={input} />;
    // }
    
    if (input.type === "chooseStatus") {
      return <FilterStatus key={index} inputData={input} />;
    }
    if (input.type === "rangeDate") {
      return <FilterWeekRange key="WeekRange" inputData={input} />;
      // return (
      //   <>
      //     {/* <FilterDateRange key={index} inputData={input} />; */}
      //     <FilterWeekRange key="WeekRange" inputData={input} />;
      //   </>
      // );
    } else {
      return undefined;
    }
    
  });
  return (
      <>
        <div className="w-full  content-center text-center ">{filterInputs}
        <button className="border border-slate-800 bg-slate-100 cursor-pointer whitespace-nowrap w-min p-1 font-semibold hover:bg-slate-600 hover:text-slate-100 rounded" onClick={() => setShowModal(true)}>📅</button>
        {showModal && createPortal(<JsonPopup closeModal={() => setShowModal(false)} />, document.body)}
        </div>
      </>
      )
}

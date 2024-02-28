import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from "react-dom";
// import FilterRange from "./FilterRange";
// import FilterListbox from "./FilterListbox";
//import FilterDate from "./FilterDate";
//import FilterDateRange from "./FilterDateRange";
// import FilterWeekRange from "./FilterWeekRange";
// import FilterStatus from "./FilterStatus";
import JsonPopup  from "./JsonPopup";
// import { updatePlanning } from "../../features/competitions";

export default function ButtonCalendar() {
  const [showModal,setShowModal] = useState(false)

  
  return (
      <>
        <button className="hover:text-opacity-80 m-1 flex border border-slate-800  bg-slate-100 cursor-pointer whitespace-nowrap w-min text-xl p-[3px]  font-semibold hover:bg-slate-600 hover:text-slate-100 rounded" onClick={() => setShowModal(true)}>📅</button>
        {showModal && createPortal(<JsonPopup closeModal={() => setShowModal(false)} />, document.body)}
      </>
      )
}

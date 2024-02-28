import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import FilterDates from "./FilterDates";
import ButtonCalendar from "./ButtonCalendar";
import ListCompetition from "../CompetitionList/ListCompetition";
import FilterListbox from "./FilterListbox";
import FilterRange from "./FilterRange";
import FilterStatus from "./FilterStatus";


export default function FilterBar({ inputData }) {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(true);
  const filterState = useSelector((state) => state.filterProperties);
  

  // console.log(filterState)
  // useEffect(() => {
  //   dispatch(updatePlanningPerso(planningPerso))
  // }, []);
 

  return (
    <>
      <nav className="fixed top-0 object-right-top right-0 md:w-auto flex z-50 w-full bg-slate-200 p-[1px]">
        <div className="relative w-full  ">
          <div className="flex flex-col place-items-end  ">
            <div className="flex flex-row  items-center ">
              <ButtonCalendar/>
              <FilterDates/>
              <button
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
                className="rounded hover:text-opacity-80 flex border border-slate-800 bg-slate-100 cursor-pointer w-min text-xl p-[3px] font-semibold hover:bg-slate-600 hover:text-slate-100"
                //className="hover:text-opacity-80 m-1 flex border border-slate-800 bg-slate-100 cursor-pointer whitespace-nowrap w-min text-2xl  font-semibold hover:bg-slate-600 hover:text-slate-100 rounded"
              >
                {showFilters ? "➖" : "➕"}
              </button>
            </div>
          </div>
        </div>
      </nav>
            <div className={(showFilters ? "" : "hidden") + " fixed top-[46px] bg-slate-200 object-right-top right-0 flex w-auto flex-col z-50"}>
            <FilterListbox key="1" inputData={filterState[0]} />
            <FilterRange key="2" inputData={filterState[2]} />
            <FilterRange key="3" inputData={filterState[3]} />
            <FilterStatus key="4" inputData={filterState[1]} />
            </div>
      <div className="flex top-10 w-full fixed h-svh  md:top-0">        
        <ListCompetition/>
      </div>
    
    </>
  );
}

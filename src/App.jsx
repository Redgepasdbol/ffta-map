//import React, { useState, useEffect, useRef } from "react";
import React from "react";

// import ListItem from "./components/ListItem";

// import { filter } from "./features/competitions";
// import {  useDispatch,useSelector } from "react-redux";
// import MapComponent from "./components/MapComponent";
import Map from "./layout/Map/Map";
import CompetitionList from "./layout/CompetitionList/CompetitionList";
import FilterPanel from "./layout/FilterPanel/FilterPanel";
import FilterBar from "./layout/FilterPanel/FilterBar";

function App() {
  return (
    <>
    <FilterBar></FilterBar>
      {/* <div className="w-full flex flex-row bg-indigo-200">
        <div className="flex w-44">
          <FilterPanel />
        </div>
        <div className="flex w-1/4  h-svh  ">
          <CompetitionList />
        </div>
        <div className="flex w-3/4 h-svh">
          <Map />
        </div>
      </div> */}
    </>
  );
}

export default App;

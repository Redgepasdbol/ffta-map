import { configureStore } from "@reduxjs/toolkit";
import competitions from "./features/competitions";
import filterProperties from "./features/filterProperties";
import customMarker from "./features/customMarker";
import planningPerso from "./features/planningPerso";

export const store= configureStore({
    reducer:{
        competitions,
        filterProperties,
        customMarker,
        planningPerso,
    }
})
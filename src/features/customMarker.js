import { createSlice } from "@reduxjs/toolkit";


const initialState = { current : 
    {
        description:"C'est l'origine",
        enabled:false,
        latLon :[45.813,3.1876]
    },
    origin : 
    {
        description:"C'est l'origine",
        enabled:true,
        latLon :[45.813,3.1876],
        competition : {}
    }   ,
    customs: []

}


export const customMarker = createSlice({
    name: "customMarker",
    initialState,
    reducers: {
        addMarker: (state, action) => {
             console.log(action.payload)            
        },
        updateCurrentMarker: (state, action) => {
            //console.log(action.payload)
            state.current.latLon = [action.payload.address.lat,action.payload.address.lon]
            state.current.competition = action.payload
       },
       resetCompetition: (state, action) => {
        //console.log(action.payload)        
        state.current.competition = undefined
   },
    }
})

export const { addMarker,updateCurrentMarker,resetCompetition } = customMarker.actions
export default customMarker.reducer
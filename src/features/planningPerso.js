import { createSlice } from "@reduxjs/toolkit";



// Chemin du fichier JSON de sauvegarde
const filePath = "../../src/data/planning.json";

const initialState = {
    user:"testUser",
    description:"",
    selected : [
        {
            id: "123",
            description: "les 2 jours",
            competitionId: "15724",
            dates: ["2024-06-22","2024-06-23"],
        },
        {
            id: "456",
            description: "1 jour",
            competitionId: "16542",
            dates: ["2024-06-16"]
        },
        {
            id: "789",
            description: "seulement dimanche",
            competitionId: "3619",
            dates: ["2024-03-03"]
        },        
    ] 
}


const saveDataToLocalStorage = (data) => {
    localStorage.setItem("planningPerso", JSON.stringify(data));
    console.log("Données sauvegardées dans le stockage local");
};

// Fonction pour charger les données depuis le stockage local
const loadDataFromLocalStorage = () => {
    const data = localStorage.getItem("planningPerso");
    return data ? JSON.parse(data) : initialState;
};



export const planningPerso = createSlice({
    name: "planningPerso",
    initialState,
    reducers: {
        updatePlanningPerso: (state, action) => {

            const index = state.selected.findIndex(item => item.competitionId === action.payload.competitionId);
  
            if (index === -1 && action.payload.dates.length > 0) {
              // Ajouter la compétition si elle n'existe pas et si elle a des dates
              state.selected.push(action.payload)              
            } else if (index !== -1 && action.payload.dates.length > 0) {
              // Mettre à jour la compétition si elle existe déjà et si elle a des dates              
              state.selected[index] = action.payload;
            } else if (index !== -1 && action.payload.dates.length === 0) {
              // Supprimer la compétition si elle existe et si elle n'a pas de dates              
              state.selected.splice(index, 1);
            }

            saveDataToLocalStorage(state);


        },
        addPlanningPerso: (state, action) => {            
            state.selected.push(action.payload)
            saveDataToLocalStorage(state);
            //console.log(state)
        },
        removePlanningPerso: (state, action) => {            
            //state.selected.push(action.payload)
            //console.log(state)

            const filtered = state.selected.filter(
                (item) =>
                item.competitionId !== action.payload.competitionId
            )
            state.selected = filtered
            saveDataToLocalStorage(state);
        },
        loadPlanningJSON : (state,action)=>{
            
            state.user=action.payload.user
            state.description=action.payload.description
            state.selected=action.payload.selected

            //console.log(state)
        },
        loadPlanning : (state,action)=>{
            const loadData = loadDataFromLocalStorage()
            state.user=loadData.user
            state.description=loadData.description
            state.selected=loadData.selected
            saveDataToLocalStorage(state);
        }
    }
})

export const { updatePlanningPerso,addPlanningPerso,removePlanningPerso,loadPlanning,loadPlanningJSON } = planningPerso.actions
export default planningPerso.reducer
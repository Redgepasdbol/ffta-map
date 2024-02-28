import { createSlice,createAction,createReducer } from "@reduxjs/toolkit"
import data from "../../src/data/competitions.json";


const initialState = {
    list: [],
    limitStatus: 1,
    planning:{
        user:"",
        description:"",
        selected : []
    }
}

const getYesterdayDateISOString = () => {
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() - 50);
    return currentDateTime.toISOString();
};


//   function isOnPlanning(competition){
//     const id = competition.id
//     let found = false
//     planning.selected.forEach((item) => {
//       if (item.competitionId === id) {
//         console.log(id + "-OK")
//         found= true; 
//       }  
//     }) 
//     return found ;
//   }

export const competitions = createSlice({
    name: "competitions",
    initialState,
    reducers: {
        updatePlanning: (state, action) => {
            state.planning = action.payload
            //console.log(action.payload) 
        },
        filter: (state, action) => {
            
            // console.log("eeee")

            const duration = action.payload.filters.find(o => o.key === 'duration');
            const distance = action.payload.filters.find(o => o.key === 'distance');
            const discipline = action.payload.filters.find(o => o.key === 'discipline');
            const week = action.payload.filters.find(o => o.key === 'rangeDate');
            const startDate = action.payload.filters.find(o => o.key === 'rangeDate').startDate;
            const endDate = action.payload.filters.find(o => o.key === 'rangeDate').endDate;

            const status = action.payload.filters.find(o => o.key === 'chooseStatus').status;
            
            const dis = []
            discipline.value.forEach(dd => {
                if (dd.checked) {
                    dis.push(dd.name)
                }
            });


            // const filtered = [];
            // const encounteredIds = new Set();

            // data.forEach((item) => {
            //     if (
            //         (duration.enabled === false || item.address.duration <= duration.value) &&
            //         (distance.enabled === false || item.address.distance <= distance.value) &&
            //         (dis.includes(item.discipline)) &&
            //         item.endDate >= startDate.value &&
            //         item.startDate <= endDate.value
            //     ) {
            //         if (!encounteredIds.has(item.id)) {
            //             encounteredIds.add(item.id);
            //             filtered.push(item);
            //         }
            //     }
            // });

            // // Trier la liste filtrée
            // filtered.sort((a, b) => a.address.duration < b.address.duration ? -1 : 1);

            //console.log(data.length)
            //console.log(startDate)

            let dedup = [];
            const encounteredIds = new Set();


            const currentDateTime = new Date();
            currentDateTime.setDate(currentDateTime.getDate() - state.limitStatus);

            
            data.forEach((item) => {
                if (!encounteredIds.has(item.id)) {
                    encounteredIds.add(item.id);
                    item.onPlanning= false; 
                    state.planning.selected.forEach((planningItem) => {
                        //console.log(planningItem.competitionId)
                        if (planningItem.competitionId === item.id) {                          
                            item.onPlanning= true;                             
                        }  
                    }) 


                    // item.onPlanning = isOnPlanning(item.id)
                    if (item.creationDate > currentDateTime.toISOString()) {
                        item.status = "NEW"
                    } else {
                        if (item.lastUpdateDate > currentDateTime.toISOString()) {
                            item.status = "UPDATED"
                        }else{
                            item.status = "ALL"
                        }
                    }
                    dedup.push(item);
                }
            });



            const filtered = dedup.filter(
                (item) =>
                    ((status === "NEW" && item.status === "NEW")  || (status === "UPDATED" && item.status === "UPDATED") || (status === "PLANNING" && item.onPlanning === true) || (status === "ALL" )) &&
                    
                    (duration.enabled === false || item.address.duration <= duration.value) &&
                    (distance.enabled === false || item.address.distance <= distance.value) &&
                    (dis.includes(item.discipline)) && 
                    (week.enabled === false || (item.endDate >= startDate.value && item.startDate <= endDate.value))
                    // item.endDate >= startDate.value && item.startDate <= endDate.value
            ).sort((a, b) => (status === "PLANNING" ? (a.startDate < b.startDate ? -1 : 1) : ((a.address.duration? a.address.duration:999999999) < (b.address.duration? b.address.duration:999999999) ? -1 : 1)))

            const modifiedCompetitions = filtered.map(competition => ({
                ...competition,
                // isNew: (competition.lastUpdateDate > getYesterdayDateISOString())
            }));

            state.list = modifiedCompetitions

            // for (const competition of state.list) {
            //     competition.isNew = (competition.lastUpdateDate > getYesterdayDateISOString )
            // }
            // ).sort((a, b) => a.startDate.substring(6, 10) + "-" + a.startDate.substring(3, 5) + "-" + a.startDate.substring(0, 2) < b.startDate.substring(6, 10) + "-" + b.startDate.substring(3, 5) + "-" + b.startDate.substring(0, 2) ? -1 : 1)

        }
    },
    extraReducers: builder => {
        builder.addCase(todoAdded, (state, action) => {
            console.log(action.payload)
        })
      }
})

const todoAdded = createAction('planningPerso/addPlanningPerso');



// console.log(initialState);
export const { filter,updatePlanning } = competitions.actions
export default competitions.reducer

import { createSlice } from "@reduxjs/toolkit";


const initialState = [
    {
        inputNumber: 1,
        name: "Discipline",
        key: "discipline",
        value: [
            { name: "Tir en campagne", checked: true },
            { name: "Tir 3d", checked: true },
            { name: "Tir nature", checked: true },
            { name: "Tir à 18m", checked: false },
            { name: "Tir à l'arc extérieur", checked: false },
            { name: "Tournoi poussin", checked: true },
            { name: "Loisirs", checked: true }
        ],
        enabled: false,
        type: "select",

    },
    {
        inputNumber: 5,
        key: "chooseStatus",
        status: "ALL",
        type: "chooseStatus",
    },
    {
        inputNumber: 2,
        name: "Durée trajet",
        key: "duration",
        value: 150,
        step: 10,
        type: "range",
        enabled: true,
        minMax: [10, 600],
    },
    {
        inputNumber: 3,
        name: "Distance",
        key: "distance",
        value: 100,
        step: 10,
        enabled: false,
        type: "range",
        minMax: [0, 900],
    },
    {
        inputNumber: 4,
        key: "rangeDate",
        enabled: true,
        mode:"week",
        startDate: {
            value: "2024-02-13",
            name: "Date début",
            enabled: true
        },
        endDate: {
            value: "2024-07-13",
            name: "Date fin",
            enabled: true
        },
        type: "rangeDate",
    }
]


export const filterProperties = createSlice({
    name: "filterProperties",
    initialState,
    reducers: {
        updateBoxValue: (state, action) => {
            // console.log(action.payload)
            if (action.payload.value) {
                state.find(el => el.inputNumber === action.payload.inputNumber).value = action.payload.value
            } else {
                state.find(el => el.inputNumber === action.payload.inputNumber).enabled = action.payload.enabled
            }
        },
        updateBoxWeek: (state, action) => {
            // console.log(action.payload)
            state.find(el => el.inputNumber === action.payload.inputNumber).enabled = action.payload.enabled
        },
        updateListboxValue: (state, action) => {
            state.find(el => el.inputNumber === action.payload.inputNumber).value.find(el2 => el2.name === action.payload.key).checked = action.payload.checked
        },
        updateDateValue: (state, action) => {
            console.log(action.payload)
            if (action.payload.code === "startDate") {
                state.find(el => el.inputNumber === action.payload.inputNumber).startDate.value = action.payload.value
            }
            if (action.payload.code === "endDate") {
                state.find(el => el.inputNumber === action.payload.inputNumber).endDate.value = action.payload.value
            }
        },
        updateWeekValue: (state, action) => {
            //console.log(action.payload)

            state.find(el => el.inputNumber === action.payload.inputNumber).startDate.value = action.payload.startDate
            state.find(el => el.inputNumber === action.payload.inputNumber).endDate.value = action.payload.endDate

        },
        updateStatusValue: (state, action) => {
            //console.log(action.payload)
                state.find(el => el.inputNumber === action.payload.inputNumber).status = action.payload.status
        }
    }
})

export const { updateBoxValue, updateListboxValue, updateDateValue, updateWeekValue, updateStatusValue,updateBoxWeek } = filterProperties.actions
export default filterProperties.reducer
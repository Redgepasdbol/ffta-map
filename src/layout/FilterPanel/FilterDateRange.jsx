import { useDispatch } from "react-redux";

import { updateDateValue } from "../../features/filterProperties";

export default function FilterDateRange({ inputData }) {
  const dispatch = useDispatch();

  function handleInputDate(e) {
    const getCode=e.target.getAttribute("code")
    if (e.target.value) {
      dispatch(
        updateDateValue({
          inputNumber: inputData.inputNumber,
          code:getCode,          
          value: e.target.value,
        })
      );
    }
  }


  return (
    <div className="flex flex-col bg-indigo-200">
      <div className="my-1">
        {inputData.startDate.name}
        <input
          type="date"
          onChange={handleInputDate}
          code="startDate"
          className="mt-1  rounded  text-xs"
          value={inputData.startDate.value}
        />
      </div>
      <div className="my-1">
        {inputData.endDate.name}
        <input
          type="date"
          code="endDate"
          onChange={handleInputDate}
          className="mt-1  rounded  text-xs"
          value={inputData.endDate.value}
        />
      </div>
    </div>
  );
}

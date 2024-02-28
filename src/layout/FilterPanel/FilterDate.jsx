import { useDispatch } from "react-redux";

import { updateDateValue } from "../../features/filterProperties";

export default function FilterDate({ inputData }) {
  const dispatch = useDispatch();

  function handleInputDate(e) {
    if(e.target.value){
    dispatch(
      updateDateValue({
        inputNumber: inputData.inputNumber,
        value: e.target.value,
      })
    );
  }
  }
  return (
    <div className="my-8">
      {inputData.name}
      <input
        type="date"
        onChange={handleInputDate}
        className="mt-1  rounded"
        value={inputData.value}
      />
    </div>
  );
}

import { useDispatch } from "react-redux";

import { updateBoxValue } from "../../features/filterProperties";

export default function FilterRange({ inputData }) {
  const dispatch = useDispatch();

  function getHours(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    const formattedHours = hours > 0 ? `${hours}h` : "";
    const formattedMinutes =
      remainingMinutes > 0 ? `${remainingMinutes}` + (hours > 0 ? "" : "min") : "00";
    return (
      formattedHours +
      (formattedHours && formattedMinutes ? "" : "") +
      formattedMinutes
    );
  }

  function handleInputs(e) {
    dispatch(
      updateBoxValue({
        inputNumber: inputData.inputNumber,
        value: e.target.value,
      })
    );
  }

  function handleActivateInputs(e) {
    dispatch(
      updateBoxValue({
        inputNumber: inputData.inputNumber,
        enabled: !e.target.defaultChecked,
      })
    );
  }
  return (
    <div className="my-4 w-44 text-sm ">
      <div className="flex flex-row bg-indigo-200">
        <input
          className="flex mt-1  "
          type="checkbox"
          defaultChecked={inputData.enabled}
          onChange={handleActivateInputs}
        />
        <span className="flex ml-1 w-44 ">{inputData.name}</span>        
        {/* <input
          onChange={handleInputs}
          value={inputData.value}
          step={inputData.step}
          className="flex w-20 h-6  border-gray-200 text-right text-sm"
          type="number"
        /> */}
        <span className={inputData.enabled ? "text-nowrap " : "hidden"}>{(inputData.key === "duration" ? getHours(inputData.value) : inputData.value +"km")}</span>
      </div>
      <div className={inputData.enabled ? "mt-1 w-full flex items-center " : "hidden"}>
        <input
          className="w-full h-[10px] bg-gray-300 rounded-lg appearance-none cursor-pointer"
          type="range"
          value={inputData.value}
          onChange={handleInputs}
          step={inputData.step}
          min={inputData.minMax[0]}
          max={inputData.minMax[1]}
        ></input>
      </div>
    </div>
  );
}

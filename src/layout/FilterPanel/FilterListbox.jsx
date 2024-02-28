import { useDispatch } from "react-redux";

import { updateListboxValue } from "../../features/filterProperties";

export default function FilterListbox({ inputData }) {
  const dispatch = useDispatch();

  function handleActivateInputs(e) {
    //console.log(e.target.getAttribute("value"))
    const getName=e.target.getAttribute("value")
    dispatch(
      updateListboxValue({
        inputNumber: inputData.inputNumber,
        key: getName,
        checked: !inputData.value.find(o => o.name === getName).checked,
      })
    );
  }
  return (
    <div className="flex flex-col  w-full text-sm  text-left">
      {inputData.value.map((item) => (
        <div className="flex w-full float-left" key={item.name}>
          <span className={"border border-slate-800 cursor-pointer w-full p-1 font-semibold " + (inputData.value.find(o => o.name === item.name).checked ? "bg-slate-600 text-slate-100" : "bg-slate-100 text-slate-600")}
            key={item.name}
            value={item.name}
            onClick={handleActivateInputs}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>

    // <div className="my-8">
    //   <ul role="listbox">

    //     {inputData.value.map((item) => (
    //       <li key={item.name}>
    //         <input
    //           type="checkbox"
    //           key={item.name}
    //           value={item.name}
    //           onChange={handleActivateInputs}
    //           defaultChecked={item.checked}
    //         />
    //         {item.name}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
}

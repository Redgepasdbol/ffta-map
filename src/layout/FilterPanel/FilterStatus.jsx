import { useDispatch } from "react-redux";

import { updateStatusValue } from "../../features/filterProperties";

export default function FilterStatus({ inputData }) {
  const dispatch = useDispatch();

  function handleChecked(e) {
    const getCode = e.target.getAttribute("code");
    if (e.target.value) {
      dispatch(
        updateStatusValue({
          inputNumber: inputData.inputNumber,
          status: e.target.value,
        })
      );
    }
  }

  return (
    <div className="flex flex-col bg-indigo-200">
      <div className="my-1">
        <select
          name="sometext"
          size="4"
          onChange={handleChecked}
          value={inputData.status}
          className="p-1 text-sm w-full"
        >
          <option value="ALL">Toutes</option>
          <option value="NEW">Nouvelles</option>
          <option value="UPDATED">Mises à jour</option>
          <option value="PLANNING">Mon planning</option>
        </select>
      </div>
    </div>
  );
}

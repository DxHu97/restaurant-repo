import { useHistory, useParams } from "react-router";
import { useEffect, useState } from "react";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Seats() {
  const history = useHistory();
  const [value, setValue] = useState("");
  const [tables, setTables] = useState([]);
  const { reservationId } = useParams();
  const [error, setError] = useState(null);
  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    async function loadTables() {
        try {
            const response = await listTables(abortController.signal)
            setTables(response)
        } catch (error) {
            setError(error)
        }
    }
    loadTables()
    return () => abortController.abort();
}, [])

  const changeHandler = (event) => {
    setValue({
      [event.target.name]: event.target.value,
    });
  };

  function handleSubmit(event) {
    event.preventDefault()
    const abortController = new AbortController()
    updateTable(reservationId, Number(value.table_id), abortController.signal)
        .then(() => history.push('/dashboard'))
        .catch(setError)

    return () => abortController.abort()
}


  return (
    <div>
      <h1>Choose a table</h1>
      <ErrorAlert error={error}/>
      <form className="center" onSubmit={handleSubmit}>
          <h2 style = {{fontSize: 30}}>Table Name - Table Capacity</h2>
        {tables && (
          <div>
            <select 
            name="table_id" 
            required 
            onChange={changeHandler}>
            <option value="">Select..</option>
              {tables.map((table) => (
                <option value={table.table_id} key={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
          </div>
        )}
        <button className="button" onClick={history.goBack}>
          CANCEL
          </button>
        <button type="submit" className="button">
          SUBMIT
        </button>
      </form>
    </div>
  );
}

export default Seats;
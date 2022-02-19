import { useHistory } from "react-router";
import { useState } from "react";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function CreateTable() {
  const history = useHistory();
  const [error, setError] = useState(null);

  const initialFormData = {
    table_name: "",
    capacity: "",
  };

  const [table, setTable] = useState({ ...initialFormData });

   const handleChange = ({ target }) => {
    if (target.name === "capacity") {
      setTable({ ...table, [target.name]: Number(target.value) });
    } else {
      setTable({ ...table, [target.name]: target.value });
    }
  };

  const handleTableChange = (event) => {
    setTable({
      ...table,
      [event.target.id]: Number(event.target.value),
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await createTable(table, abortController.signal);
      history.push(`/`);
      setTable({ ...initialFormData });
    } catch (err) {
      setError(err);
    }
    return () => abortController.abort();
  }

  return (
    <div >
      <form onSubmit={handleSubmit}>
        <h1>Create Table</h1>
        <ErrorAlert error={error} />
        <label>Table Name</label>
        <input
          type="text"
          name="table_name"
          id="table_name"
          className="form-control"
          placeholder="Enter a table name"
          onChange={handleChange}
          value={table.table_name}
          required
        />
        <label>Capacity</label>
        <input
          type="number"
          name="capacity"
          className="form-control"
          id="capacity"
          placeholder="Enter capacity"
          onChange={handleTableChange}
          value={table.capacity}
          required
        />
        <div className="center" style = {{margin: 50}}>
          <button type="submit" className = "button">
            SUBMIT
          </button>
          <button className = "button" onClick={history.goBack}>
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTable;

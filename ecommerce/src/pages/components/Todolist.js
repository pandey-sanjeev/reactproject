import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Todolist() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");

  setTimeout(() => {
    setMessage("");
  }, 3000);

  function deletetodo(todoid) {
    axios
      .post(
        "http://localhost/backend/User_controller/deletetodo",
        {
          todoid: todoid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          const msg = res.data.success;
          setMessage(msg);
          fetchData()
        }
        if (res.data.error) {
          const msg = res.data.error;
          setMessage(msg);
          fetchData()

        }
      })

      .catch((err) => {
        console.error("Error", err);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios
      .get("http://localhost/backend/User_controller/usertodolist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="py-4">
          <div className="message">{message ? <p>{message}</p> : null}</div>
          <h3 className="mb-3 text-center">Todo List</h3>
          <table className="table border shadow">
            <thead className="thead-primary">
              <tr>
                <th scope="col">Serial No</th>
                <th scope="col">Todo Title</th>
                <th scope="col">Description</th>
                <th>Action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.todotitle}</td>
                  <td>{item.description}</td>
                  <td>
                    <Link
                      to={`/Edittodo/${item.todoid}`}
                      className="btn btn-success"
                    >
                      Edit
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deletetodo(item.todoid)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (<p>No data available</p>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Todolist;

import React, { useState  , useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

const Edittodo = () => {

    const [formData, setFormData] = useState({
      todotitle: '',
      description: '',
      todoid:'',
    });
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const token = localStorage.getItem("token");
    const todoid = useParams();
    setTimeout(() => {
      setMessage("");
    }, 3000);
    useEffect(() => {
      fetchData();
    }, []);
    function fetchData(){
    axios
        .post("http://localhost/backend/User_controller/tododata",todoid,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        })
        .then((response) => {
            const userdata  =response.data[0];
            
            setFormData({
              todotitle: userdata.todotitle,
              description: userdata.description,
              todoid:userdata.todoid,
            });
        })
        .catch((error) => {
        console.error("Error fetching data:", error);
        });
      }
  const validateForm = () => {
    const newErrors = {};

    if (!formData.todotitle) {
      newErrors.todotitle = "Todo Title is required";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 6) {
      newErrors.description = "Description must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm())
     {
    axios.post("http://localhost/backend/User_controller/edittodo", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            const msg = res.data.success;
            setMessage(msg);
          }
          if (res.data.error) {
            const msg = res.data.error;
            setMessage(msg);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <React.Fragment>
      <hr />

      <form className="form-horizontal" onSubmit={handleSubmit} method="">
        <div className="container ">
          <Link className="btn btn-primary" to="/Home">
            Home
          </Link>
          <h1>Edit Todo</h1>
          <div className="message">{message ? <p>{message}</p> : null}</div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Todo Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="todotitle"
                  placeholder="Enter Todo Title"
                  value={formData.todotitle}
                  onChange={(e) =>
                    setFormData({ ...formData, todotitle: e.target.value })
                  }
                />
                {errors.todotitle && <p>{errors.todotitle}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                {errors.description && <p>{errors.description}</p>}
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  type="submit"
                  className="btn btn-info"
                  value="EDIT TODO"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Edittodo;

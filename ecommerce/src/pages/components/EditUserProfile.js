import React, { useState } from "react";
import axios from "axios";
import AuthService from "./AuthService";
import { Link } from "react-router-dom";


const EditUserProfile = () => {
  const getuserdata = AuthService.getuserdata();
  const token = localStorage.getItem("token");

  setTimeout(() => {
    setMessage("");
  }, 3000);
  const [formData, setFormData] = useState({
    name: getuserdata.name,
    fathername: getuserdata.fathername,
    dob: getuserdata.dob,
    address: getuserdata.address,
    email: getuserdata.email,
    password: getuserdata.password,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!formData.name) {
      newErrors.name = "name is required";
    }
    if (!formData.fathername) {
      newErrors.fathername = "father name is required";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 6) {
      newErrors.address = "Address must be at least 6 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!regex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordpattern.test(formData.password)) {
      newErrors.password =
        "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      axios
        .post(
          'http://localhost/backend/User_controller/updatedata/',
          formData ,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        .then((res) => {
          if (res.data.success) {
            const msg = res.data.success;
            const logindata = res.data.userupdatedata[0];
            AuthService.userupdateddata(logindata);
            setMessage(msg);
          }
          if (res.data.error) {
            const msg = res.data.error;
            setMessage(msg);
          }
        })
        .catch((err) => {
          const msg = "something went wrong";
          setMessage(msg);
        });
    }
  };

  return (
    <React.Fragment>
      <form className="form-horizontal" onSubmit={handleSubmit} method="">
        <div className="container ">
          <Link to="/Home">
            <button className="btn btn-info">Home</button>
          </Link>
          <h1>Please Edit Your Profile</h1>
          <div className="message">{message ? <p>{message}</p> : null}</div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors.name && <p>{errors.name}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Father Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fathername"
                  placeholder="Enter Father Name"
                  value={formData.fathername}
                  onChange={(e) =>
                    setFormData({ ...formData, fathername: e.target.value })
                  }
                />
                {errors.fathername && <p>{errors.fathername}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Date Of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  placeholder="Date Of Birth"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
                {errors.dob && <p>{errors.dob}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="Enter Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                {errors.address && <p>{errors.address}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && <p>{errors.email}</p>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Password</label>
                <input
                  type="text"
                  className="form-control"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {errors.password && <p>{errors.password}</p>}
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <input type="submit" className="btn btn-info" value="Update" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default EditUserProfile;

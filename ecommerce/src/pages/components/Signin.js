import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";
import { Link } from "react-router-dom";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

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
        .post("http://localhost/backend/User_controller/checkuser", formData)
        .then((res) => {
          if (res.data.token) {
            const token = res.data.token;
            const logindata = res.data.logindata;
            AuthService.storetoken(token, logindata);
            Navigate("/Home");
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
      <form className="form-horizontal" onSubmit={handleSubmit} method="">
        <div className="container ">
          <h1>Please Login</h1>
          <div className="message">{message ? <p>{message}</p> : null}</div>
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
                  type="password"
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
                <input type="submit" className="btn btn-info" value="Signin" />
              </div>
              <br />
              <div>
                <Link to="/Forgotpassword">
                  <button className="btn btn-info">Forgot Password</button>
                </Link><p />
                <Link to="/Signup">
                  <button className="btn btn-info">Signup</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Signin;

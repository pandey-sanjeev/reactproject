import React, { useState } from "react";
import axios from "axios";
import { Link ,useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const passwordresetdata = localStorage.getItem("passwordresetdata");
  const userdata = JSON.parse(passwordresetdata);
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    code: "",
    email: userdata.email,
  });
  const validateForm = () => {
    const newErrors = {};
    const passwordpattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!formData.code) {
      newErrors.code = "code is required";
    } else if (formData.code.length < 4) {
      newErrors.code = "enter only 4 digit code";
    } else if (formData.code.length > 4) {
      newErrors.code = "enter only 4 digit code";
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
        .post("http://localhost/backend/User_controller/verifycode", formData)
        .then((res) => {
          if (res.data.message) {
            const msg = res.data.message;
            setMessage(msg);
            Navigate("/Signin");

            localStorage.removeItem("passwordresetdata");
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
          <h1>Hello "{userdata.name}" Please Reset Your Password</h1>
          <h2> Please check "{userdata.email}" for code </h2>
          <div className="message">
            {message ? (
              <div>
                <p>{message}</p>

                <Link to="/Signin">
                  <button className="btn btn-info">Signin</button>
                </Link>
              </div>
            ) : null}
            <br />
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">Verification Code</label>
                <input
                  type="number"
                  className="form-control"
                  name="code"
                  placeholder="Enter code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
                {errors.code && <p>{errors.code}</p>}
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="control-label ">
                  Enter your new Password
                </label>
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
                <input
                  type="submit"
                  className="btn btn-info"
                  value="Reset Password"
                />
              </div>
              <br />
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default ResetPassword;

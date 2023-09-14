import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Forgotpassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const regex =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!regex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      axios
        .post("http://localhost/backend/User_controller/sendmail", formData)
        .then((res) => {
          if (res.data.message) {
            const msg = res.data.message;
            setMessage(msg);
            const userData = res.data.userdata;
            localStorage.setItem("passwordresetdata", JSON.stringify(userData));
            Navigate("/ResetPassword");
          }
          if (res.data.error) {
            const msg = res.data.error;
            setMessage(msg);
            console.log(msg);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <React.Fragment>
      <form className="form-horizontal" onSubmit={handleSubmit} method="">
        <div className="container ">
          <h1>Please Enter your Registered Email</h1>
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
          <br />
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <input type="submit" className="btn btn-info" value="Send Mail" />
              </div>
              <br />
              <div>
                <Link to="/Signin">
                  <button className="btn btn-info">Signin</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default Forgotpassword;

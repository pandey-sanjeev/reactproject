import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";
import { Link } from "react-router-dom";

const Profile = () => {
  const Navigate = useNavigate();
  const userdata = AuthService.getuserdata();

  const Edit = () => {
    Navigate("/EditUserProfile");
  };

  return (
    <React.Fragment>
      <Link className="btn btn-primary" to="/Home">
        Home
      </Link>
      <div className="container">
        <h1>Your Profile</h1>
        <div className="container1">
          <h3>Name : {userdata.name} </h3>
        </div>
        <div className="container1">
          <h3>Father Name : {userdata.fathername} </h3>
        </div>
        <div className="container1">
          <h3>Date Of Birth : {userdata.dob} </h3>
        </div>
        <div className="container1">
          <h3>Address : {userdata.address} </h3>
        </div>
        <div className="container1">
          <h3>Email : {userdata.email} </h3>
        </div>
        <div className="container1">
          <h3>Password : {userdata.password} </h3>
        </div>
        <button className="btn btn-danger" onClick={Edit}>
          Edit
        </button>
      </div>
    </React.Fragment>
  );
};
export default Profile;

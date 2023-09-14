import React from "react";
import AuthService from "./AuthService";
import { useNavigate ,Link } from "react-router-dom";
import Profile from "./Profile";
import Todolist from "./Todolist";

const Home = () => {
  const Navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    Navigate("/Signin");
  };

  return (
    <React.Fragment>
      <h1>This is Home Page</h1>
      <Link to="/Profile">
        <button className="btn btn-info">Your Profile</button>
      </Link>
      <Link to="/Addtodo">
        <button className="btn btn-info">Add New todo</button>
      </Link>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
      <Todolist />
    </React.Fragment>
  );
};
export default Home;

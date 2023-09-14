import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/components/Signup";
import Home from "./pages/components/Home";
import NoPage from "./pages/components/NoPage";
import Signin from "./pages/components/Signin";
import EditUserProfile from "./pages/components/EditUserProfile";
import Forgotpassword from "./pages/components/Forgotpassword";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import ResetPassword from "./pages/components/ResetPassword";
import ProtectedemailRoute from "./pages/components/ProtectedEmaiRoute";
import Profile from "./pages/components/Profile";
import Addtodo from "./pages/components/Addtodo";
import Edittodo from "./pages/components/Edittodo";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route  path="/Home" element={<Home />} />
          <Route path="/EditUserProfile" element={<EditUserProfile />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Addtodo" element={<Addtodo />} />
          <Route path="/Edittodo/:id" element={<Edittodo />} />



        </Route>
        <Route element={<ProtectedemailRoute />}>
        <Route path="/ResetPassword" element={<ResetPassword />} />
        </Route>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/" element={<Signin />} />
        <Route path="/Forgotpassword" element={<Forgotpassword />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

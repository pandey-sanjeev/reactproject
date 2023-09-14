import React from 'react';
import { Outlet, Navigate} from 'react-router-dom';

const ProtectedRoute = () => {

   const Token= localStorage.getItem("token");
   return Token ? <Outlet /> : <Navigate to={'/Signin'} replace />
}

export default ProtectedRoute;

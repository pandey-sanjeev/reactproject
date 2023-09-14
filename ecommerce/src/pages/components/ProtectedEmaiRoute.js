import React from 'react';
import { Outlet, Navigate} from 'react-router-dom';

const ProtectedemailRoute = () => {

   const passwordresetdata= localStorage.getItem("passwordresetdata");
   return passwordresetdata ? <Outlet /> : <Navigate to={'/Forgotpassword'} replace />
}

export default ProtectedemailRoute;


const AuthService = {

  storetoken: (token ,logindata) =>{
    localStorage.setItem("token", token);
    localStorage.setItem("logindata", JSON.stringify(logindata));

  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("logindata");

  },
  userupdateddata: (logindata) =>{
    localStorage.setItem("logindata", JSON.stringify(logindata));

  },
  getToken: () => {
    return localStorage.getItem("token");
  },

  logindata: () => {
    return localStorage.getItem("logindata");
  },
  
  getuserdata: () => {
  const jsonString = AuthService.logindata();
  const userdata = JSON.parse(jsonString);
  return userdata;
  },
};

export default AuthService;

import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './css/index.css'; 
import './css/form.css';

const App = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      {isLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <Signup toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default App;

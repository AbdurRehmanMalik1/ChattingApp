import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './css/App.css'

const App = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="app-div">
      <div className="background app-theme-primary">
        {isLogin ? (
          <Login toggleForm={toggleForm} />
        ) : (
          <Signup toggleForm={toggleForm} />
        )}
        </div>
      </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import './css/App.css'
import {Navigate, Route,BrowserRouter as  Router, Routes } from "react-router-dom";

const App = () => {
  
  const [isLogin, setIsLogin] = useState(true); 
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (  
    <div className="app-div">
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/chat" element={<Chat/>} />
      </Routes>
      </Router>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './css/App.css'
import Chat from "./components/Chat";

const App = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const chats = [];
  async function getUserChats(){
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzdlNDdlYjQ3YzQ3YmE3YTM5YjlhMmUiLCJuYW1lIjoiQWJkdXIgUmVobWFuIiwiZW1haWwiOiJhYmR1cnJlaG1hbjQ0MTVAZ21haWwuY29tIiwiaWF0IjoxNzM2ODYyNzUzLCJleHAiOjE3MzY4Njk5NTN9.Ts7OIvl3rQ7VCjrgJiT54PMrshKCe76mOedezda1aBQ";
    const bearerToken = `Bearer ${token}`
    try {
        const response = await fetch('http://localhost:8080/chat/my', {
          method: "GET",
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': bearerToken
          }
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
  }
  getUserChats();
  return (
    // <div className="app-div">
    //     {isLogin ? (
    //       <Login toggleForm={toggleForm} />
    //     ) : (
    //       <Signup toggleForm={toggleForm} />
    //     )}
    // </div>

    <Chat/>
  );
};

export default App;

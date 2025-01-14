import React, { useState } from "react";
import '../css/index.css';
import '../css/form.css';
import '../css/App.css'
import { useNavigate } from "react-router-dom";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate(); 

  const [formValues, setFormValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  function capitalizeFirstLetter(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const handleLoginRedirect = () => {
    const dataToPass = { from: 'Login Page', message: 'Welcome to Chat' };
    navigate('/chat', { state: dataToPass });
  };
  const login = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",  // Use POST to send data
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues), // Convert form data to JSON
      });
  
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      handleLoginRedirect();
    } catch (err) {
      console.error("Error during login:", err); // Handle error
    }
  };
  return (
    <div className="background app-theme-primary">
        <div className="login-container app-theme-secondary">
          <div className="logo">🎧 ChatSphere</div>
          <h2 style={{marginBottom:"10px"}}>Welcome Back!</h2>
          <form className="login-form">
            {['email','password'].map((value:string,index:number)=>{              
                return <div key={index} className="login-form-row">
                <label style={{textAlign:"center"}} htmlFor={value}>{capitalizeFirstLetter(value)}</label>
                <input value={formValues[value as keyof LoginFormValues]} onChange={handleInputChange} type={value} id={value} name={value}/>
              </div>
            })}
            <div style={{textAlign:"center"}} className="link-container">
              <a href="#">Forgot password?</a>
            </div>
            <button type="button" onClick={login} className="btn">Log In</button>
          </form>
          <p>
            Don't have an account?{" "}
            <button 
              onClick={()=>navigate('/signup')}
              style={{
                color:' #5865f2',
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: '1em'
              }}
            >
              Sign Up
            </button>
          </p>
        </div>
    </div>
  );
};

export default Login;

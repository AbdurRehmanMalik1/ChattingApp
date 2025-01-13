import React from "react";
import '../css/index.css';
import '../css/form.css';

const Login = ({ toggleForm }) => {
  function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    
        <div className="login-container app-theme-secondary">
          <div className="logo">🎧 ChatSphere</div>
          <h2 style={{marginBottom:"10px"}}>Welcome Back!</h2>
          <form className="login-form">
            {['email','password'].map((value,index)=>{
              return <div className="login-form-row">
                <label style={{textAlign:"center"}} htmlFor={value}>{capitalizeFirstLetter(value)}</label>
                <input type={value} id={value} name={value}/>
              </div>
            })}
            <div style={{textAlign:"center"}} className="link-container">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn">Log In</button>
          </form>


          <p>
            Don't have an account?{" "}
            <button
              onClick={toggleForm}
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
      
    
  );
};

export default Login;

import React, { useState } from 'react'
import './css/Login.css'
import user_icon from './assets/person.png'
import email_icon from './assets/email.png'
import password_icon from './assets/password.png'
import phone_icon from './assets/output-onlinepngtools (1).png'

 const Login = () => {

    const [action,setAction] = useState("Sign Up");

  return (
    <div className='container'>
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            {action==="Login"?<div></div>: <div><div className="input">
                <img src={user_icon} alt="" />
                <input type="text" placeholder="Enter First Name" /></div>
                <br></br>
                <div className="input">
                <img src={user_icon} alt="" />
                <input type="text" placeholder="Enter Last Name" /></div>
                <br></br>
                <div className="input">
                <img src={phone_icon} alt="" />
                <input type="text" placeholder="Enter Phone Number" />
                </div>    
            </div>}
           
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder="Enter E-mail" />
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Enter Password"/>
            </div>
        </div>
        {action==="Sign Up"?<div></div>:<div className="forgot-password">Lost Password? <span>Click Here!</span></div>}
        
        <div className="submit-container">
            <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
            <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>
    </div>
  );
}

export default Login
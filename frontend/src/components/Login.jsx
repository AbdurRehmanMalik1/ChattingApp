import React from "react";
import '../css/index.css';
import '../css/form.css';

const Login = ({ toggleForm }) => {
  return (
    <div className="background app-theme-primary">
      <div>
        <div className="form-container app-theme-secondary">
          <div className="logo">🎧 ChatSphere</div>
          <h2>Welcome Back!</h2>
          <form className="login-form">
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required />
            </div>
            <div className="link-container">
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
      </div>
    </div>
  );
};

export default Login;

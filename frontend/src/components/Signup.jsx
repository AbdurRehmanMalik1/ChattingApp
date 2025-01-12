import React, { useEffect } from "react";
import '../css/index.css';
import '../css/form.css';

const Signup = ({ toggleForm }) => {
  useEffect(() => {
    const daySelect = document.getElementById("dob-day");
    const yearSelect = document.getElementById("dob-year");

    for (let i = 1; i <= 31; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }

    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      yearSelect.appendChild(option);
    }
  }, []);

  return (
    <div className="background app-theme-primary">
      <div className="form-container signup-form app-theme-secondary">
        <div className="logo">🎧 ChatSphere</div>
        <h2>Create Your Account</h2>

        <form>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required />

          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            pattern="[0-9]{10}"
            required
          />

          <label htmlFor="display-name">Display Name</label>
          <input
            type="text"
            id="display-name"
            required
          />

          <label htmlFor="username">Username</label>
          <input type="text" id="username" required />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            required
          />

          <label htmlFor="dob">Date of Birth</label>
          <div className="dob">
            <select id="dob-month" required>
              <option value="" disabled selected>
                Month
              </option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
            <select id="dob-day" required>
              <option value="" disabled selected>
                Day
              </option>
            </select>
            <select id="dob-year" required>
              <option value="" disabled selected>
                Year
              </option>
            </select>
          </div>

          <button type="submit" className="btn">
            Sign Up
          </button>
        </form>

        <p>
          Already have an account?{" "}
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
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;

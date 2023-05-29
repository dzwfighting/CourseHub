import React, { useState } from "react";
import AuthService from "../services/auth.service";

const RegisterComponent = () => {
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleEmil = (e) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e) => {
    console.log(e.target);
    console.log(e.target.value);
    setPassword(e.target.value);
  };
  const handleRole = (e) => {
    setRole(e.target.value);
  };
  const handleRegister = () => {
    console.log(username, email, password, role);
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert("Register Success, you will be redirected login page");
      })
      .catch((e) => {
        console.log(e);
        Window.alert("Error");
      });
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        <div>
          <label htmlFor="username">UserName:</label>
          <input
            onChange={handleUsername}
            type="text"
            className="form-control"
            name="username"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            onChange={handleEmil}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="The length must exceed 6, consist of digits and letters"
            onChange={handlePassword}
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Role: </label>
          <input
            onChange={handleRole}
            type="text"
            className="form-control"
            placeholder="must input student or instructor"
            name="role"
          />
        </div>
        <br />
        <button onClick={handleRegister} className="btn btn-primary">
          <span>Register</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;

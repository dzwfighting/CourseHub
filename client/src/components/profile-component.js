import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && <div>Please Login, then tou can see this page</div>}
      {currentUser && (
        <div>
          <h2>User Profile: </h2>

          <table className="table">
            <tbody>
              <tr>
                <td>
                  <strong>Name: {currentUser.user.username}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>UserID: {currentUser.user._id}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>User Email: {currentUser.user.email}</strong>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Role: {currentUser.user.role}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;

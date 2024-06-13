import React, { useState } from "react";
import "./Auth.css";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="authform">
      <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === "login" ? "active" : ""}`}
            id="tab-login"
            onClick={() => handleTabClick("login")}
            role="tab"
            aria-controls="pills-login"
            aria-selected={activeTab === "login"}
          >
            Login
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className={`nav-link ${activeTab === "register" ? "active" : ""}`}
            id="tab-register"
            onClick={() => handleTabClick("register")}
            role="tab"
            aria-controls="pills-register"
            aria-selected={activeTab === "register"}
          >
            Register
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div
          className={`tab-pane fade ${
            activeTab === "login" ? "show active" : ""
          }`}
          id="pills-login"
          role="tabpanel"
          aria-labelledby="tab-login"
        >
          <form>
            <div data-mdb-input-init className="form-outline mb-3">
              <input type="email" id="loginName" className="form-control" />
              <label className="form-label" htmlFor="loginName">
                Email or username
              </label>
            </div>

            <div data-mdb-input-init className="form-outline mb-3">
              <input
                type="password"
                id="loginPassword"
                className="form-control"
              />
              <label className="form-label" htmlFor="loginPassword">
                Password
              </label>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 d-flex justify-content-center">
                <div className="form-check mb-3 mb-md-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="loginCheck"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="loginCheck">
                    Remember me
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              data-mdb-button-init
              data-mdb-ripple-init
              className="btn btn-primary btn-block mb-3"
            >
              Sign in
            </button>
          </form>
        </div>
        <div
          className={`tab-pane fade ${
            activeTab === "register" ? "show active" : ""
          }`}
          id="pills-register"
          role="tabpanel"
          aria-labelledby="tab-register"
        >
          <form>
            <div data-mdb-input-init className="form-outline mb-3">
              <input type="text" id="registerName" className="form-control" />
              <label className="form-label" htmlFor="registerName">
                Name
              </label>
            </div>

            <div data-mdb-input-init className="form-outline mb-3">
              <input
                type="text"
                id="registerUsername"
                className="form-control"
              />
              <label className="form-label" htmlFor="registerUsername">
                Username
              </label>
            </div>

            <div data-mdb-input-init className="form-outline mb-3">
              <input type="email" id="registerEmail" className="form-control" />
              <label className="form-label" htmlFor="registerEmail">
                Email
              </label>
            </div>

            <div data-mdb-input-init className="form-outline mb-3">
              <input
                type="password"
                id="registerPassword"
                className="form-control"
              />
              <label className="form-label" htmlFor="registerPassword">
                Password
              </label>
            </div>

            <div data-mdb-input-init className="form-outline mb-3">
              <input
                type="password"
                id="registerRepeatPassword"
                className="form-control"
              />
              <label className="form-label" htmlFor="registerRepeatPassword">
                Repeat password
              </label>
            </div>

            <button
              type="submit"
              data-mdb-button-init
              data-mdb-ripple-init
              className="btn btn-primary btn-block mb-3"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;

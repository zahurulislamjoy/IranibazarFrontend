import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import supershopimg from "../../image/supershop.webp";
import supershoplogo from "../../image/logo.png";
import "./loginpage.css";

const SuperShopLogin = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleFromSignIn = (event) => {
    event.preventDefault();

    localStorage.setItem("username", userName);
    if (!userName && !password) {
      toast.error("Username and password are required");
      return;
    }
    navigate("/home", {
      state: {
        username: userName,
        password: password,
      },
    });
  };

  return (
    <div className="full_div_login_page">
      <img className="img-full-view" src={supershopimg} alt="" />
      <div className="bg-tranparant-background"></div>
      <div className="container_super_shop_login">
        <div className="container_super_shop_all">
          <span className="heading">Sign-In</span>
          <div className="logo-login-container">
            <img className="super-shop-logo" src={supershoplogo} alt="" />
            <div className="bg-tranparant-login"></div>
          </div>
          <form className="from_super_shop_login" onSubmit={handleFromSignIn}>
            <div className="input_field_super_shop_login">
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                required
              />
            </div>
            <div className="input_field_super_shop_login">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {showPassword ? (
                <FaEyeSlash
                  className="icon-login"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaEye
                  className="icon-login"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <button className="login-button" type="submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default SuperShopLogin;

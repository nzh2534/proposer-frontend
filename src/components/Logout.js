import React, { useEffect } from "react";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.post("logout/blacklist/", {
      refresh_token: localStorage.getItem("refresh_token"),
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    axiosInstance.defaults.headers["Authorization"] = null;
    navigate("/login");
  }, [navigate]);
  return <Loading />;
}

export default Logout;

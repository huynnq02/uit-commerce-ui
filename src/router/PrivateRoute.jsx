import React from "react";
import { Route, useNavigate, Outlet } from "react-router-dom";
import Header from "../components/organisms/Header";
import { useSelector } from "react-redux";
const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  console.log("isLoggedIn", isLoggedIn);
  return <>{isLoggedIn ? <Outlet></Outlet> : navigate("/sign-in")}</>;
};

export default PrivateRoute;

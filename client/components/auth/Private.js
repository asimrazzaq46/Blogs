import React, { useEffect } from "react";
import { isAuth } from "./../../actions/auth";
import Router from "next/router";

const Private = ({children}) => {
  

  useEffect(() => {
    if (!isAuth()) {
      Router.push("/signin");
    }else if(isAuth().role !== 0){
      Router.push("/signin");

    }
   
  }, []);
  return <div>{children}</div>;
};

export default Private;

import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import GoogleLogin from "react-google-login";
import Router from "next/router";

import { GOOGLE_CLIENT_ID } from "../../config/config";
import { googleSignIn, authenticateUSer, isAuth } from "../../actions/auth";

const GoogleAuth = () => {
  const responseGoogle = async (response) => {
    const tokenId = response.tokenId;
    const data = await googleSignIn({ tokenId });
    if (data.error) {
      console.log(`error in google login component`, data.error);
    } else {
      authenticateUSer(data, () => {
        if (isAuth() && isAuth().role === 1) {
          Router.push("/admin");
        } else {
          Router.push("/user");
        }
      });
    }
  };

  return (
    <Fragment>
      <div className="login-with-google-div float-left ">
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          theme="dark"
        />
      </div>
    </Fragment>
  );
};

export default GoogleAuth;

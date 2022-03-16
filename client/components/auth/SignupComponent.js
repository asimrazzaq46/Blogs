import React, { Fragment, useState, useEffect } from "react";
import { signUp, isAuth } from "./../../actions/auth";
import Router from "next/router";

const SignupComponent = () => {
  //creating values for storing data with useState hook
  const [values, setvalues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });
  const routeOnLogin = () => {
    if (isAuth() && isAuth().role === 0) {
      Router.push("/user");
    }

    if (isAuth() && isAuth().role === 1) {
      Router.push("/admin");
    }
  };
  //getting out the values form values variable above
  const { name, email, password, error, loading, message, showForm } = values;

  //function on Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setvalues({ ...values, error: false, loading: true });

    const user = { name, email, password };

    //sending data in actions signup
    signUp(user).then((data) => {
      if (data.error) {
        setvalues({ ...values, loading: false, error: data.error });
      } else {
        //setting values on default after succefully creating user
        setvalues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          message: data.message,
          loading: false,
          showForm: false,
        });
      }
    });
  };

  //Handle values on input forms
  const handleChange = (name) => (e) => {
    setvalues({ ...values, error: false, [name]: e.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";
  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";

  //SignUp form Function
  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={name}
            className="form-control"
            onChange={handleChange("name")}
            placeholder="Type your name"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            value={email}
            className="form-control"
            onChange={handleChange("email")}
            placeholder="Type your email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            className="form-control"
            onChange={handleChange("password")}
            placeholder="Type your password"
          />
        </div>
        <div className="text-center">
          <button className="btn btn-primary ">SignUp</button>
        </div>
      </form>
    );
  };

  useEffect(() => {
    routeOnLogin();
  }, []);

  return (
    <Fragment>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signupForm()}
    </Fragment>
  );
};

export default SignupComponent;

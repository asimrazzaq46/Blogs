import React, { Fragment, useState, useEffect } from "react";
import { signIn, authenticateUSer, isAuth } from "./../../actions/auth";
import { useRouter } from "next/router";

const SigninComponent = () => {
  //creating values for storing data with useState hook
  const [values, setValues] = useState({
    email: "asim@hotmail.com",
    password: "asim123",
    error: "",
    loading: false,
  });
  const router = useRouter();

  const routeOnLogin = () => {
    if (isAuth() && isAuth().role === 0) {
      router.push("/user");
    }
    if (isAuth() && isAuth().role === 1) {
      router.push("/admin");
    }
  };

  //getting out the values form values variable above

  const { email, password, error, loading } = values;

  //Handle values on input forms
  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  // Handle Form Submitting
  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true });
    const user = { email, password };
    signIn(user).then((data) => {
      if (data.error) {
        setValues({ ...values, loading: false, error: data.error });
      } else {
        setValues({ ...values, error: data.error, loading: false });
        //Save User TOken In Cookies
        //save User Info in Local Storage
        //Authenticate User
        authenticateUSer(data, () => {
          routeOnLogin();
        });
      }
    });
  };

  //show error if there is any error
  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  //show loading while loading
  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading</div> : "";

  //signin Form
  const signinForm = (e) => {
    return (
      <div>
        <form onSubmit={handleSubmit}>
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
            <button className="btn btn-primary ">Signin</button>
          </div>
        </form>
      </div>
    );
  };

  useEffect(() => {
    routeOnLogin();
  }, []);

  return (
    <Fragment>
      {showError()}
      {showLoading()}
      {signinForm()}
    </Fragment>
  );
};

export default SigninComponent;

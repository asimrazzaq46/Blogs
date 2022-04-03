import React, { Fragment, useEffect, useState } from "react";
import { withRouter } from "next/router";
import Layout from "../../../components/Layout";
import { forgotPassword } from "../../../actions/auth";

const reset = () => {
  const [values, setValues] = useState({
    email: "",
    message: "",
    error: "",
    showForm: true,
  });

  const { email, message, error, showForm } = values;

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, message: "", error: "" });

    const data = await forgotPassword({ email });
    if (data.error) {
      console.log(`error in password reset pages ${data.error}`);
      setValues({ ...values, error: data.error });
    } else {
      setValues({
        ...values,
        message: data.message,
        email: "",
        showForm: false,
      });
    }
  };

  const showErrorMessage = () => {
    return error && <div className="alert alert-danger">{error}</div>;
  };

  const showSuccessMessage = () => {
    return message && <div className="alert alert-info">{message}</div>;
  };

  const passwordResetForm = () => {
    return (
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group pt-5">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={handleChange("email")}
              placeholder="Type your email"
              required
            />
          </div>
          <div>
            <button className="btn btn-primary">Reset</button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Fragment>
      <Layout>
        <div className="container">
          <h2>Forgot Password </h2>
          <hr />
          {showErrorMessage()}
          {showSuccessMessage()}
          {showForm && passwordResetForm()}
        </div>
      </Layout>
    </Fragment>
  );
};

export default reset;

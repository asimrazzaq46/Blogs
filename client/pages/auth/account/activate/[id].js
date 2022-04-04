import React, { Fragment, useState, useEffect } from "react";
import { withRouter } from "next/router";
import jwt from "jsonwebtoken";

import { signUp } from "../../../../actions/auth";
import Layout from "../../../../components/Layout";

const confirmAccount = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    error: "",
    loading: false,
    success: false,
    showButton: true,
  });

  const { name, token, error, loading, success, showButton } = values;

  const clickSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const data = await signUp({ token });
    if (data.error) {
      console.log(`error in activate account pages`, data.error);
      setValues({
        ...values,
        error: data.error,
        loading: false,
        showButton: false,
      });
    } else {
      setValues({
        ...values,
        loading: false,
        success: true,
        showButton: false,
      });
    }
  };

  const showLoading = () =>
    loading && <h2 className="alert alert-info">Loading...</h2>;
  const showError = () =>
    error && <h2 className="alert alert-danger">{error} </h2>;

  const showSuccess = () =>
    success && (
      <p className="alert alert-success">
        You have succefully activated your account please Signin.
      </p>
    );

  useEffect(() => {
    let token = router.query.id;

    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, [router]);

  return (
    <Fragment>
      <Layout>
        <div className="container">
          <div className="text-center">
            <h3 style={{ display: error ? "none" : "" }}>
              Hye {name}, Ready to Activate your Account?
            </h3>
          </div>
          {showLoading()}
          {showError()}
          {showSuccess()}
          {showButton && (
            <div className="text-center">
              <button
                className="btn btn-outline-primary mt-3"
                onClick={clickSubmit}
              >
                Activate
              </button>
            </div>
          )}
        </div>
      </Layout>
    </Fragment>
  );
};

export default withRouter(confirmAccount);

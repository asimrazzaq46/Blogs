import React, { Fragment, useState } from "react";
import { withRouter } from "next/router";

import Layout from "../../../../components/Layout";
import { resetPassword } from "../../../../actions/auth";
import { route } from "next/dist/server/router";

const reset = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    newPassword: "",
    error: "",
    message: "",
    showForm: true,
  });

  const { name, newPassword, error, message, showForm } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordInfo = {
      resetPasswordLink: router.query.id,
      newPassword,
    };

    const data = await resetPassword(passwordInfo);

    if (data.error) {
      setValues({
        ...values,
        error: data.error,
        showForm: false,
        newPassword: "",
      });
    } else {
      setValues({
        ...values,
        showForm: false,
        message: data.message,
        newPassword: "",
        name: "",
      });
    }
  };

  const passwordResetForm = () => {
    return (
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group pt-5">
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) =>
                setValues({ ...values, newPassword: e.target.value })
              }
              placeholder="New Password"
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
  const showErrorMessage = () => {
    return error && <div className="alert alert-danger">{error}</div>;
  };

  const showSuccessMessage = () => {
    return message && <div className="alert alert-info">{message}</div>;
  };

  return (
    <Fragment>
      <Layout>
        <div className="container">
          <h2> Reset Password </h2>
          <hr />
          {showErrorMessage()}
          {showSuccessMessage()}
          {showForm && passwordResetForm()}
        </div>
      </Layout>
      ;
    </Fragment>
  );
};

export default withRouter(reset);

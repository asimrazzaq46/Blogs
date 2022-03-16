import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";

import { isAuth, getCookie } from "../../actions/auth";
import { create } from "../../actions/category";

const Category = () => {
  const newCategoryForm = () => {
    const [values, setValues] = useState({
      name: "",
      error: false,
      success: false,
      categories: [],
      removed: false,
    });

    const { name, error, success, removed } = values;

    const token = getCookie("token");
    //Input Values Change Handler
console.log(`token in crud component`,token);
    const handleChange = (e) => {
      setValues({ ...values, name: e.target.value, error: false });
    };

    //Form Handler
    const handleForm = (e) => {
      e.preventDefault();
      setValues({ ...values, error: false, success: false });
      create({name}, token).then((data) => {
        console.log('data in crud component',data);
        // if (data.error) {
        //   setValues({ ...values, error: data.error, success: false });
        // } else {
        //   setValues({ ...values, error: false, success: true });
        // }
      });
    };

    return (
      <form onSubmit={handleForm}>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    );
  };

  return <Fragment>{newCategoryForm()}</Fragment>;
};

export default Category;

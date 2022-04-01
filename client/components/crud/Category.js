import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";

import { isAuth, getCookie } from "../../actions/auth";
import { list } from "../../actions/blog";
import {
  create,
  getCategories,
  singleCategory,
  removeCategory,
} from "../../actions/category";

const Category = () => {
  // Initialized
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    categories: [],
    removed: false,
  });

  const { name, error, success, removed, categories } = values;

  const token = getCookie("token");
  //Input Values Change Handler

  const handleChange = (e) => {
    setValues({ ...values, name: e.target.value, error: false });
  };

  const showCategories = () => {
    return categories.map((c, i) => {
      //deleteConfirm(c.slug)
      return (
        <button
          onDoubleClick={() => deleteConfirm(c.slug)}
          key={i}
          className="btn btn-outline-primary mr-1 ml-1 mt-3"
        >
          {c.name}
        </button>
      );
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (answer) {
      removeCategory(slug, token).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            removed: !removed,
          });
        }
      });
    }
  };

  //Form Handler
  const handleForm = (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, success: false, removed: false });
   
    create({ name }, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: "",
        });
      }
    });
  };

  //getting all categories
  const loadCategories = async () => {
    const data = await getCategories();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setValues({
        ...values,
        categories: data,
      });
    }
  };

  //success message when we create the category
  const showSuccess = () => {
    if (success) {
      return <p className="text-success">Category is created</p>;
    }
  };

  //show error when something goes wrong

  const showError = () => {
    if (error) {
      return <p className="text-danger">{error}</p>;
    }
  };

  //return message when we delete the category
  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">Category is removed</p>;
    }
  };

  //hide messages
  const mouseMoveHandler = (e) => {
    setValues({ ...values, error: false, removed: false, success: false });
  };

  //every time render when something change
  useEffect(() => {
    loadCategories();
  }, [success, removed]);

  //Form
  const newCategoryForm = () => {
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

  return (
    <div>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {newCategoryForm()}
        {showCategories()}
      </div>
    </div>
  );
};

export default Category;

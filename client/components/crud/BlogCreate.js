import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import dynamic from "next/dynamic";
//
import { isAuth, getCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { allTags } from "../../actions/tag";
import { create } from "../../actions/blog";
import { modules, formats } from "../../helpers/quill";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
import "../../node_modules/react-quill/dist/quill.snow.css";

const BlogCreate = ({ router }) => {
  //Blog from localStorage on refresh
  const blogFromLocalStorage = () => {
    //if we refresh the window
    if (typeof window === "undefined") {
      return false;
    }
    // if there is any item in localStorage with name Blog
    if (localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };

  const [body, setBody] = useState(blogFromLocalStorage());
  const [values, setValues] = useState({
    title: "",
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    hidePublishButton: false,
  });

  //Store Categories and Tags from Database
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  //store Categories and Tags on check box
  const [checkedCategory, setCheckedCategory] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const { title, error, sizeError, success, formData, hidePublishButton } =
    values;

  //getting token from cookies
  const token = getCookie("token");

  /////////////////////////////// creating and Handling form //////////////////

  //Handle Body on ReactQuill
  const handleBody = (e) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
    setBody(e);
    formData.set("body", e);
  };

  //Handling values on input fields
  const changeHandler = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);

    setValues({ ...values, [name]: value, formData, error: "" });
  };

  //Handling Form on sumbimission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await create(formData, token);
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setValues({
        ...values,
        error: "",
        title: "",
        hidePublishButton: true,
        success: `A new blog titled ${data.title} is created.`,
      });
      setBody("");
      setCategories([]);
      setTags([]);
    }

    console.log(`ready to publish`, formData);
  };

  //Creating a Form
  const createBlogForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={changeHandler("title")}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            value={body}
            modules={modules}
            formats={formats}
            placeholder="Write something amazing..."
            onChange={handleBody}
            style={{ minHeight: "200px" }}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  //initializing Categories on page reload
  const initCategories = async () => {
    const data = await getCategories();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setCategories(data);
    }
  };

  //initializing Tags on page reload
  const initTags = async () => {
    const data = await allTags();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setTags(data);
    }
  };

  //On Toggle checkbox Categories and Tags

  const handleToggleCategories = (value) => () => {
    setValues({ ...values, error: "" });
    const clickedCategory = checkedCategory.indexOf(value);
    const allCategories = [...checkedCategory];

    if (clickedCategory === -1) {
      allCategories.push(value);
    } else {
      allCategories.splice(clickedCategory, 1);
    }
    setCheckedCategory(allCategories);
    formData.set("categories", allCategories);
  };

  const handleToggleTags = (value) => {
    setValues({ ...values, error: "" });
    const clickedTag = checkedTag.indexOf(value);
    const allTag = [...checkedTag];

    if (clickedTag === -1) {
      allTag.push(value);
    } else {
      allTag.splice(clickedTag, 1);
    }
    setCheckedTag(allTag);
    formData.set("tags", allTag);
  };
  /////////////////////////////RENDERING CATEGORIES AND TAGS//////////////

  const renderCategories = () => {
    return (
      categories &&
      categories.map((category, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggleCategories(category._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{category.name}</label>
        </li>
      ))
    );
  };

  const renderTags = () => {
    return (
      tags &&
      tags.map((tag, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={() => handleToggleTags(tag._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  /////////// STYLE THE RENDER TAGS AND CATEGORIES ////////

  const style = {
    maxHeight: "200px",
    overflowY: "scroll",
  };

  ///////////////// Render Success or Error Messages

  const showError = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };

  const showSuccess = () => {
    console.log(`success message ${success}`);
    return (
      <div
        className="alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        {success}
      </div>
    );
  };

  //////////////////// USE EFFECT /////////////////

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });

    initCategories();
    initTags();
  }, [router]);

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured Images</h5>
              <hr />
              <small className="text-muted">Max Size: 1mb</small>
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  type="file"
                  accept="image/*"
                  onChange={changeHandler("photo")}
                  hidden
                />
              </label>
            </div>
          </div>
          <h5>Categories</h5>
          <hr />
          <ul style={style}>{renderCategories()}</ul>

          <h5>Tags</h5>
          <hr />
          <ul style={style}>{renderTags()}</ul>
        </div>
      </div>
    </div>
  );
};

export default withRouter(BlogCreate);

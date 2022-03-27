import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import dynamic from "next/dynamic";
//
import { isAuth, getCookie } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { allTags } from "../../actions/tag";
import { updateBlog, singleBlog } from "../../actions/blog";
import { API } from "../../config/config";
import { modules, formats } from "../../helpers/quill";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
import "../../node_modules/react-quill/dist/quill.snow.css";

const BlogUpdate = ({ router }) => {
  //INITIALIAZING VARIABLES WITH USE STATES

  const [body, setBody] = useState("");
  const [values, setValues] = useState({
    title: "",
    error: "",
    success: "",
    formData: "",
    hidePublishButton: false,
  });

  const [Categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  //store Categories and Tags on check box
  const [checkedCategory, setCheckedCategory] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const { title, error, success, formData, hidePublishButton } = values;

  const token = getCookie("token");

  //initializing Categories on page reload
  const loadCategories = async () => {
    const data = await getCategories();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setCategories(data);
    }
  };

  //initializing Tags on page reload
  const loadTags = async () => {
    const data = await allTags();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setTags(data);
    }
  };

  //LOading the blog
  const loadBlog = async () => {
    const { slug } = router.query;
    if (slug) {
      const data = await singleBlog(slug);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, formData: new FormData(), title: data.title });
        setBody(data.body);
        setCategoriesArray(data.categories);
        setTagsArray(data.tags);
      }
    }
  };

  //SET CHECKED CATEGORIES AND SET CHECKED TAGS ON FIRST RENDER////////////////////

  const setCategoriesArray = (categories) => {
    let categoryArray = [];
    categories.map((category) => categoryArray.push(category._id));
    return setCheckedCategory(categoryArray);
  };

  const setTagsArray = (tags) => {
    let tagsArray = [];
    tags.map((tag) => tagsArray.push(tag._id));
    return setCheckedTag(tagsArray);
  };

  const findCheckedCategory = (id) => {
    const check = checkedCategory.indexOf(id);
    if (check === -1) {
      return false;
    }
    return true;
  };

  const findCheckedTag = (id) => {
    const check = checkedTag.indexOf(id);
    if (check === -1) {
      return false;
    }
    return true;
  };
  /////////////////////////////////////////
  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
  };

  const editBlog = () => {
    console.log(`edit blog`);
  };

  const changeHandler = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;

    formData.set(name, value);

    setValues({ ...values, formData, [name]: value, error: "" });
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
      Categories &&
      Categories.map((category, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggleCategories(category._id)}
            type="checkbox"
            checked={findCheckedCategory(category._id)}
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
            checked={findCheckedTag(tag._id)}
            className="mr-2"
          />
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { slug } = router.query;
    const data = await updateBlog(formData, slug, token);
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setValues({
        ...values,
        error: "",
        success: `Blog title : "${data.title}" is created successfully.`,
      });

      if (isAuth() && isAuth().role === 1) {
        router.replace(`/admin`);
      } else if (isAuth() && isAuth().role === 0) {
        router.replace(`/user`);
      }
    }
  };

  const createUpdateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            value={title}
            className="form-control"
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
            Update
          </button>
        </div>
      </form>
    );
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
    return (
      <div
        className="alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        {success}
      </div>
    );
  };

  useEffect(() => {
    loadBlog();
    loadCategories();
    loadTags();
  }, [router]);

  /////////// STYLE THE RENDER TAGS AND CATEGORIES ////////

  const style = {
    maxHeight: "200px",
    overflowY: "scroll",
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {createUpdateForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
         {body && <img src={`${API}/blog/photo/${router.query.slug}`} alt={title} style={{width:'100%'}} />}
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

export default withRouter(BlogUpdate);

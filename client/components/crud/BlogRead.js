import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";

import { isAuth, getCookie } from "../../actions/auth";
import { list, updateBlog, deleteBlog } from "../../actions/blog";
import moment from "moment";

const BlogRead = () => {
  const [values, setValues] = useState({
    blogs: [],
    error: "",
    success: "",
    message: "",
  });

  const { blogs, error, success, message } = values;

  const token = getCookie("token");

  //LOADING ALL THE BLOG LIST
  const loadBlogs = async () => {
    const data = await list();
    if (data.error) {
      console.log(`error in blog read component`, data.error);
      setValues({ ...values, error: data.error });
    } else {
      setValues({ ...values, error: "", blogs: data.blog });
    }
  };

  //REMOVE BLOG BUTTON HANDLER
  const removeBlog = async (blog) => {
    const answer = window.confirm(
      `Are you sure you want to remove ${blog.title} blog? `
    );
    const { slug } = blog;
    if (!answer) {
      return;
    }
    const data = await deleteBlog(slug, token);
    if (data.error) {
      console.log(`error in deleting blog read compoent`, data.error);
      setValues({ ...values, error: data.error });
    } else {
      setValues({
        ...values,
        success: true,
        message: data.message,
      });
    }
  };

  //SHOW UPDATE BLOG BUTTON
  const showUpdateButton = (blog) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/blog/${blog.slug}`}>
          <a className="btn btn-sm btn-warning ml-2">Update</a>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className="btn btn-sm btn-warning ml-2">Update</a>
        </Link>
      );
    }
  };

  //RENDERING ALL THE BLOGS
  const showAllBlogs = () => {
    return blogs.map((blog, i) => (
      <div key={i} className="mt-5">
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <h3>{blog.title}</h3>
          </a>
        </Link>
        <p className="mark">
          Written by {blog.postedBy.name} | published on{" "}
          {moment(blog.updatedAt).fromNow()}
        </p>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => removeBlog(blog)}
        >
          Delete
        </button>
        {showUpdateButton(blog)}
      </div>
    ));
  };

  const showDeleteMessage = () => {
    if (message) {
      return <p className="alert alert-warning">{message}</p>;
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [success]);
  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {message && showDeleteMessage()}
            {showAllBlogs()}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BlogRead;

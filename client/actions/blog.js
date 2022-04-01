import fetch from "isomorphic-fetch";
import { API } from "../config/config";
import { isAuth, handleResponse } from "./auth";
import querystring from "query-string";

//////////////CREATE BLOG//////////////////
export const create = async (blogData, token) => {
  const url =
    isAuth() && isAuth().role === 1 ? `${API}/blog` : `${API}/user/blog`;
  try {
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blogData,
    });
    handleResponse(response);
    const data = await response.json();
    return data;
  } catch (err) {
    return err;
  }
};

//////////////LIST OF ALL BLOGS//////////////////
export const list = async (username) => {
  const url =
    isAuth() && isAuth().username === username
      ? `${API}/${username}/blogs`
      : `${API}/blogs`;

  const response = await fetch(`${url}`, {
    method: "GET",
  });

  return response.json();
};

//////////////LIST OF ALL BLOGS CATEGORIES AND TAGS//////////////////

export const listBlogsCategoriesTags = async (skip, limit) => {
  const data = { skip, limit };
  const response = await fetch(`${API}/blogs-categories-tags`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const dataBlog = await response.json();

  return dataBlog;
};

//////////////SINGLE BLOG//////////////////

export const singleBlog = async (slug) => {
  const response = await fetch(`${API}/blog/${slug}`, {
    method: "GET",
  });

  return response.json();
};

//////////////LIST OF ALL BLOGS CATEGORIES AND TAGS//////////////////

export const listOfRelatedBlogs = async (blog) => {
  const response = await fetch(`${API}/blog/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  });

  const data = await response.json();

  return data;
};

////////////// UPDATE BLOG //////////////////

export const updateBlog = async (blogdata, slug, token) => {
  const url =
    isAuth() && isAuth().role === 1 ? `${API}/blog` : `${API}/user/blog`;
  const response = await fetch(`${url}/${slug}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blogdata,
  });
handleResponse(response)
  const data = await response.json();

  return data;
};

////////////// DELETE BLOG //////////////////

export const deleteBlog = async (slug, token) => {
  const url =
    isAuth() && isAuth().role === 1 ? `${API}/blog` : `${API}/user/blog`;
  const response = await fetch(`${url}/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
handleResponse(response)
  const data = await response.json();

  return data;
};

////////////// SEARCH BLOG //////////////////

export const searchBlogs = async (params) => {
  let query = querystring.stringify(params);

  const response = await fetch(`${API}/blogs/search?${query}`, {
    method: "GET",
  });

  const data = await response.json();

  return data;
};

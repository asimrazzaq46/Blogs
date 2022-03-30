import fetch from "isomorphic-fetch";
import { API } from "../config/config";
import querystring from "query-string";

//////////////CREATE BLOG//////////////////
export const create = async (blogData, token) => {
  try {
    const response = await fetch(`${API}/blog`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blogData,
    });

    return response.json();
  } catch (err) {
    console.log(err);
  }
};

//////////////LIST OF ALL BLOGS//////////////////
export const list = async () => {
  const response = await fetch(`${API}/blogs`, {
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
  const response = await fetch(`${API}/blog/${slug}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blogdata,
  });

  const data = await response.json();

  return data;
};

////////////// DELETE BLOG //////////////////

export const deleteBlog = async (slug, token) => {
  const response = await fetch(`${API}/blog/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
};

////////////// SEARCH BLOG //////////////////

export const searchBlogs = async (params) => {
  console.log(`Search params action`, params);

  let query = querystring.stringify(params);

  console.log(`Search query action`, query);

  const response = await fetch(`${API}/blogs/search?${query}`, {
    method: "GET",
  });
  if (response.error) {
    console.log(`search Blog action`, response.error);
  }
  const data = await response.json();

  return data;
};

import fetch from "isomorphic-fetch";
import { API } from "../config/config";

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

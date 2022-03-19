import fetch from "isomorphic-fetch";
import { API } from "../config/config";

//Create Category
export const create = async (category, token) => {
  try {
    const response = await fetch(`${API}/category`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

// Get the list of all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API}/categories`, {
      method: "GET",
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

// Get the single category
export const singleCategory = async (slug) => {
  try {
    const response = await fetch(`${API}/category/${slug}`, {
      method: "GET",
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

// Delete category
export const removeCategory = async (slug, token) => {
  try {
    const response = await fetch(`${API}/category/${slug}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

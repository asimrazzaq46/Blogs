import fetch from "isomorphic-fetch";
import { API } from "../config/config";
import { handleResponse } from "./auth";

//Create Category
export const create = async (category, token) => {
  
  
    const response = await fetch(`${API}/category`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    handleResponse(response)
    return response.json();
 
};

// Get the list of all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API}/categories`, {
      method: "GET",
    });
    return response.json();
  } catch (err) {
    return err;
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
    return err;
  }
};

// Delete category
export const removeCategory = async (slug, token) => {
 
    const response = await fetch(`${API}/category/${slug}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    handleResponse(response)
    return response.json();
 
};

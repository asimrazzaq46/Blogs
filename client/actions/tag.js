import fetch from "isomorphic-fetch";
import { API } from "../config/config";
import { getCookie } from "./auth";

export const create = async (tag, token) => {
  try {
    const response = await fetch(`${API}/tag`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tag),
    });

    return response.json();
  } catch (err) {
    console.log(err);
  }
};

//Get All tags
export const allTags = async () => {
  try {
    const response = await fetch(`${API}/tags`, {
      method: "GET",
    });

    return response.json();
  } catch (err) {
    console.log(err);
  }
};

//Get single Tag

//Get All tags
export const singleTag = async (slug, token) => {
  try {
    const response = await fetch(`${API}/tag/${slug}`, {
      method: "GET",
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

//Delete Tag

export const removeTag = async (slug, token) => {
  try {
    const response = await fetch(`${API}/tag/${slug}`, {
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

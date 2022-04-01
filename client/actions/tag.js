import fetch from "isomorphic-fetch";
import { API } from "../config/config";
import { getCookie, handleResponse } from "./auth";

export const create = async (tag, token) => {
  const response = await fetch(`${API}/tag`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(tag),
  });
  handleResponse(response);
  return response.json();
};

//Get All tags
export const allTags = async () => {
  const response = await fetch(`${API}/tags`, {
    method: "GET",
  });

  return response.json();
};

//Get single Tag

export const singleTag = async (slug) => {
  const response = await fetch(`${API}/tag/${slug}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

//Delete Tag

export const removeTag = async (slug, token) => {
  const response = await fetch(`${API}/tag/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  handleResponse(response);
  return response.json();
};

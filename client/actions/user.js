import fetch from "isomorphic-fetch";
import { API } from "../config/config";
import { handleResponse } from "./auth";

///////////////// USER PUBLIC PROFILE ///////////

export const userPublicProfile = async (username) => {
  const response = await fetch(`${API}/profile/${username}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();
  return data;
};

/////////////////  USER PRIVATE PROFILE ///////////

export const userPrivateProfile = async (token) => {
  const response = await fetch(`${API}/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  handleResponse(response);
  const data = await response.json();
  return data;
};

///////////////// UPDATE USER PROFILE ///////////

export const updateUserProfile = async (formData, token) => {
  const response = await fetch(`${API}/profile/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
handleResponse(response)
  const data = await response.json();
  return data;
};

export const profilePhoto = async (username) => {
  const response = await fetch(`${API}/profile/photo/${username}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return response;
};

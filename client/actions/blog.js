import fetch from "isomorphic-fetch";
import { API } from "../config/config";

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

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

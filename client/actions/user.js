import fetch from "isomorphic-fetch";
import { API } from "../config/config";

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

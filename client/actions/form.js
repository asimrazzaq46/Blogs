import fetch from "isomorphic-fetch";
import { API } from "../config/config";

export const emailContactForm = async (messageData) => {
  const url = messageData.AuthorEmail
    ? `${API}/contact-blog-author`
    : `${API}/contact`;

  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });

  const data = await response.json();
  return data;
};

import fetch from "isomorphic-fetch";
import cookie from "js-cookie";
import { API } from "../config/config";

//Signup Action
export const signUp = async (userData) => {
  try {
    const response = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`ERROR IN SIGNUP ACTION`, err.response.data.message);
  }
};

// Signin Action
export const signIn = async (userData) => {
  try {
    const response = await fetch(`${API}/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`ERROR IN SIGNUP ACTION`, err.response.data.message);
  }
};

//Signout Action (in Header Component)

export const signout = async (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
  try {
    const data = await fetch(`${API}/signout`, {
      method: "GET",
    });
   return data;
  } catch (err) {
    return err.response.data.message;
  }
};

/////////////////////////COOKIES//////////////////

//SET COOKIE IN BROWSER
export const setCookie = (key, value) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

//REMOVE COOKIE FROM BROWSER
export const removeCookie = (key) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

//GET COOKIE FROM BROWSER
export const getCookie = (key) => {
  if (process.browser) {
    return cookie.get(key);
  }
};

////////////////////////////LOCAL STORAGE/////////////

//SET USER INFO IN LOCAL STORAGE
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

//REMOVE USER INFO IN LOCAL STORAGE
export const removeLocalStorage = (key) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

/////////////////////AUTHENTICATE USER///////////////

export const authenticateUSer = (data, next) => {
  setCookie("token", data.token);
  setLocalStorage("user", data.user);
  next();
};

export const isAuth = () => {
  if (process.browser) {
    //check if there is a cookie and user stored
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

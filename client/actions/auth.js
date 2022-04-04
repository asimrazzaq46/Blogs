import fetch from "isomorphic-fetch";
import cookie from "js-cookie";
import { API } from "../config/config";
import Router from "next/router";

//check if the JWT-Token is expired ==> redirect them to signIn and clear local storage and cookies

export const handleResponse = (response) => {
  if (response.status === 401) {
    removeCookie("token");
    removeLocalStorage("user");
    Router.push({
      pathname: `/signin`,
      query: {
        message: "Your session is expired! please Signin.",
      },
    });
  } else {
    return;
  }
};

// CONFIRM ON SIGNUP

export const preSignUp = async (userData) => {
  const response = await fetch(`${API}/pre-signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
};

//Signup Action
export const signUp = async (userData) => {
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
};

// Signin Action
export const signIn = async (userData) => {
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
};

//Signout Action (in Header Component)

export const signout = async (next) => {
  removeCookie("token");
  removeLocalStorage("user");
  next();

  const data = await fetch(`${API}/signout`, {
    method: "GET",
  });
  return data;
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

/////////////////////AUTHENTICATE AND PRESIST USER///////////////

export const authenticateUSer = (data, next) => {
  setCookie("token", data.token);
  setLocalStorage("user", data.user);

  next();
};

/////////////////////// AUTHENTICATING USER /////////////////

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

/////////////////////// UPDATEING EXSITING USER /////////////////

export const updateUser = (newUserData, next) => {
  if (process.browser) {
    if (localStorage.getItem("user")) {
      let oldUser = JSON.parse(localStorage.getItem("user"));
      oldUser = newUserData;
      localStorage.setItem("user", JSON.stringify(oldUser));
      next();
    }
  }
};

/////////////////////// FORGOT PASSWORD /////////////////

export const forgotPassword = async (email) => {
  const response = await fetch(`${API}/forgot-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });
  const data = await response.json();
  return data;
};
/////////////////////// RESET PASSWORD /////////////////

export const resetPassword = async (resetInfo) => {
  const response = await fetch(`${API}/reset-password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "content-Type": "application/json",
    },
    body: JSON.stringify(resetInfo),
  });
  const data = await response.json();
  return data;
};

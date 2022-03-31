import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";

import { userPrivateProfile, updateUserProfile } from "../../actions/user";
import { getCookie, isAuth, updateUser } from "../../actions/auth";
import { API } from "../../config/config";

const ProfileUpdate = () => {
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    about: "",
    error: false,
    success: false,
    loading: false,
    photo: "",
    username_for_photo: "",
    userData: "",
  });

  const {
    username,
    name,
    email,
    password,
    about,
    error,
    success,
    loading,
    photo,
    username_for_photo,
    userData,
  } = values;

  // Get TOken From Cookies to authenticate
  const token = getCookie("token");

  //Loading Logged In user Profile
  const loadUserProfile = async () => {
    const data = await userPrivateProfile(token);
    if (data.error) {
      return setValues({ ...values, error: data.error });
    }
    const user = data;
    setValues({
      ...values,
      name: user.name,
      username: user.username,
      username_for_photo: data.username,
      email: user.email,
      about: user.about,
      userData: new FormData(),
    });
  };

  //UPDATE LOCAL STORAGE User

  const updateLocalStorage = () => {
    localStorage.getItem("user");
  };

  //Input values change handler
  const changeHandler = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;

    userData.set(name, value);
    setValues({
      ...values,
      [name]: value,
      userData,
      error: false,
      success: false,
    });
  };

  // Form Submission handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    const data = await updateUserProfile(userData, token);
    if (data.error) {
      setValues({
        ...values,
        error: data.error,
        loading: false,
        success: false,
      });
    } else {
      updateUser(data, () => {
        setValues({
          ...values,
          success: true,
          loading: false,
          name: data.name,
          username: data.username,
          email: data.email,
          about: data.about,
        });
      });
    }
  };

  // Create Update User Form
  const createProfileUpdateForm = () => {
    return (
      <form onSubmit={submitHandler}>
        <div className="form-group ">
          <label className=" btn btn-outline-info">
            Profile photo
            <input
              type="file"
              accept="image/*"
              onChange={changeHandler("photo")}
              className="form-control"
              hidden
            />
          </label>
          <small className="text-muted pl-2">Max Size: 1mb</small>
        </div>
        <div className="form-group">
          <label className="text-muted">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={changeHandler("username")}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={changeHandler("name")}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={changeHandler("email")}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">About</label>
          <textarea
            type="email"
            className="form-control"
            value={about}
            onChange={changeHandler("about")}
            placeholder="Write Something about you..."
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={changeHandler("password")}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    );
  };

  //ERROR MESSAGE

  const showErrorMessage = () => {
    if (error) {
      return (
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {" "}
          {error}{" "}
        </div>
      );
    }
  };

  //SUCCESS MESSAGE

  const showSuccessMessage = () => {
    if (success) {
      return (
        <div
          className="alert alert-success"
          style={{ display: success ? "" : "none" }}
        >
          Profile Updated
        </div>
      );
    }
  };

  //LOADING MESSAGE

  const showLoadingMessage = () => {
    if (loading) {
      return (
        <div
          className="alert alert-info"
          style={{ display: loading ? "" : "none" }}
        >
          Loading...
        </div>
      );
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img
              className="img img-fluid img-thumbnail mb-3"
              src={
                !username ? "" : `${API}/profile/photo/${username_for_photo}`
              }
              style={{ maxHeight: "auto", maxWidth: "100%" }}
              alt={`${name} profile photo`}
            />
          </div>
          <div className="col-md-8">
            {" "}
            {showErrorMessage()}
            {showSuccessMessage()}
            {showLoadingMessage()}
            {createProfileUpdateForm()}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileUpdate;

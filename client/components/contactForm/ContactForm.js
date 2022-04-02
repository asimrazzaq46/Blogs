import React, { Fragment, useState, useEffect } from "react";
import { emailContactForm } from "../../actions/form";
import Link from "next/link";

const ContactForm = ({ AuthorEmail }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    sent: false,
    buttonText: "Send Message",
    success: false,
    error: false,
  });

  const { name, email, message, sent, buttonText, success, error } = values;

  const changeHandler = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      buttonText: "Send Message",
      success: false,
      error: false,
    });
  };

  //handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, buttonText: "sending..." });
    const data = await emailContactForm({ AuthorEmail, name, email, message });
    if (data.error) {
      console.log(`error in contactForm components `, data.error);
      setValues({ ...values, error: data.error, success: false });
    } else {
      setValues({
        ...values,
        buttonText: "sent ✔",
        success: data.success,
        sent: true,
        name: "",
        email: "",
        message: "",
      });
    }
  };

  //Create Contact Form
  const createContactForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className=" form-group">
          <label className="lead">Message</label>
          <textarea
            type="text"
            className="form-control"
            rows="10"
            value={message}
            onChange={changeHandler("message")}
          />
        </div>
        <div className="form-group">
          <label className="lead">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={changeHandler("name")}
            required
          />
        </div>
        <div className="form-group">
          <label className="lead">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={changeHandler("email")}
            required
          />
        </div>

        <div>
          <button className="btn btn-primary">{buttonText}</button>
        </div>
      </form>
    );
  };

  //Show Success Message
  const successMessage = () => {
    return (
      success && (
        <p className="alert alert-info">Thank you for contacting us.</p>
      )
    );
  };
  //Show Error Message
  const errorMessage = () => {
    return error && <p className="alert alert-danger">{error}</p>;
  };

  return (
    <Fragment>
      <div className="container-fluid">
        {successMessage()}
        {errorMessage()}
        {createContactForm()}
      </div>
    </Fragment>
  );
};

export default ContactForm;

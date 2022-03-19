import React, { useEffect, useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import { deleteTag } from "../../../server/controllers/tags/tagsController";
import { getCookie } from "../../actions/auth";
import { create, allTags, singleTag, removeTag } from "../../actions/tag";

const Tags = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    tags: [],
    removed: false,
  });

  //getting all values out from state
  const { name, error, success, removed, tags } = values;

  //get token
  const token = getCookie("token");

  //Form input values change handler
  const chnageHandler = (e) => {
    setValues({ ...values, name: e.target.value, error: false });
  };

  // form submition handler
  const submitHandler = async (e) => {
    e.preventDefault();
    const data = await create({ name }, token);
    if (data.error) {
      setValues({ ...values, error: data.error, success: false });
    } else {
      setValues({ ...values, error: false, success: true, name: "" });
    }
  };

  // Form create function
  const formTag = () => {
    return (
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            className="form-control"
            onChange={chnageHandler}
            value={name}
            required
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    );
  };

  //get all tags
  const loadTags = async () => {
    const data = await allTags();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setValues({ ...values, tags: data });
    }
  };

  // render all Tags

  const renderTags = () => {
    return tags.map((tag, i) => {
      return (
        <button
          key={i}
          onDoubleClick={() => deleteTag(tag.slug)}
          className="btn btn-outline-primary mr-1 mt-3 ml-1"
        >
          {tag.name}
        </button>
      );
    });
  };

  //Delete Tag
  const deleteTag = async (slug) => {
    const answer = window.confirm("Are you sure you want to delete this tag?");
    if (answer) {
      const data = await removeTag(slug, token);
      if (data.error) {
        setValues({ ...values, removed: false, error: data.error });
      } else {
        setValues({ ...values, removed: true });
      }
    }
  };
  //show success message
  const showSuccess = () => {
    if (success) {
      return <p className="text-success">Created Succefully</p>;
    }
  };

  //show error message

  const showError = () => {
    if (error) {
      return <p className="text-danger">{error}</p>;
    }
  };

  //show removed message

  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">Tag Removed</p>;
    }
  };

  //hide messages
  const mouseMoveHandler = (e) => {
    setValues({ ...values, error: false, removed: false, success: false });
  };

  useEffect(() => {
    loadTags();
  }, [success, removed]);

  return (
    <Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {formTag()}
        {renderTags()}
      </div>
    </Fragment>
  );
};

export default Tags;

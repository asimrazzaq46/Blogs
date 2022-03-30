import React, { useState, useEffect } from "react";
import Link from "next/link";

import { searchBlogs } from "../../actions/blog";
import { Fragment } from "react/cjs/react.production.min";
import { API } from "../../config/config";
const Search = () => {
  const [values, setValues] = useState({
    search: "",
    results: [],
    message: "",
    searched: false,
  });

  const { search, results, message, searched } = values;

  const searchedResult = (results = []) => {
    return (
      <div className="jumbotron bg-white">
        {message && <p className="pt-4 text-muted font-italic">{message}</p>}

        {results.map((blog, i) => {
          return (
            <div key={i} className="pt-2 row">
              <div className="col-md-1">
                <Link href={`/blogs/${blog.slug}`}>
                  <img
                    className="img img-fluid rounded"
                    src={`${API}/blog/photo/${blog.slug}`}
                    onClick={() => setValues({ ...values, searched: false })}
                    alt={blog.title}
                  />
                </Link>
              </div>
              <div className="col-md-4 align-self-center">
                <Link href={`/blogs/${blog.slug}`}>
                  <a
                    className="text-primary"
                    onClick={() => setValues({ ...values, searched: false })}
                  >
                    {blog.title}
                  </a>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: [],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = await searchBlogs({ search });
    if (data.error) {
      console.log(`error in search submit handler`, data.error);
      setValues({ ...values, message: data.error, searched: true });
    } else {
      setValues({
        ...values,
        results: data,
        searched: true,
        message: `${data.length} blogs found.`,
      });
    }
  };

  const searchForm = () => {
    return (
      <form onSubmit={submitHandler}>
        <div className="row">
          <div className="col-md-8">
            <input
              type="search"
              className="form-control"
              placeholder="Search Blogs"
              value={search}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-block btn-outline-primary" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="pt-3 pb-5">
          {searchForm()}
          {searched && (
            <div style={{ marginTop: "-60px", marginBottom: "-90px" }}>
              {searchedResult(results)}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Search;

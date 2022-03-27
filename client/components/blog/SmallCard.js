import React from "react";
import moment from "moment";
import Link from "next/link";
import renderHtml from "react-render-html";

import { API } from "../../config/config";

const SmallCard = ({ blog }) => {
  return (
    <div className="card">
      <section>
        <a href={`/blogs/${blog.slug}`}>
          <img
            className="img img-fluid "
            style={{ maxHeight: "150px", width: "100%", cursor: "pointer" }}
            src={`${API}/blog/photo/${blog.slug}`}
            alt={blog.title}
          />
        </a>
      </section>
      <div className="card-body">
        <section>
          <a href={`/blogs/${blog.slug}`}>
            <h5 className="card-title">{blog.title}</h5>
          </a>
          <p className="card-text">{renderHtml(blog.excerpt)}</p>
        </section>
      </div>
      <div className="card-body">
        Posted {moment(blog.updatedAt).fromNow()} by{" "}
        <Link href="/">
          <a className="float-right">{blog.postedBy.name}</a>
        </Link>
      </div>
    </div>
  );
};

export default SmallCard;

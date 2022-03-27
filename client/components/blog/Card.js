import React from "react";
import Link from "next/link";
import moment from "moment";
import { API } from "../../config/config";

const Card = ({ blog }) => {
  const showBlogCategories = (categories) => {
    return categories && categories.map((category, i) => (
      <Link key={i} href={`/categories/${category.slug}`}>
        <a className="btn btn-primary ml-1 mr-1 mt-3">{category.name}</a>
      </Link>
    ));
  };

  const showBlogTags = (tags) => {
    return tags && tags.map((tag, i) => (
      <Link key={i} href={`/tags/${tag.slug}`}>
        <a className="btn btn-outline-primary ml-1 mr-1 mt-3">{tag.name}</a>
      </Link>
    ));
  };

  return (
    <div className="lead pb-4">
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <h2 className="display-4 pt-3 pb-3 font-weight-bold">
              {blog.title}
            </h2>
          </a>
        </Link>
      </header>
      <section>
        <p className="mark ml-1 pt-2 pb-2">
        
            Written by {blog.postedBy?.name} | published{" "}
            {moment(blog.updatedAt).fromNow()}
         
        </p>
      </section>
      <section>
        {showBlogCategories(blog.categories)}
        {showBlogTags(blog.tags)}
        <br />
        <br />
      </section>
      <div className="row">
        <div className="col-md-4">
          <section>
            <Link href={`blogs/${blog.slug}`}>
              <img
                className="img img-fluid"
                style={{ maxHeight: "auto", width: "100%", cursor: "pointer" }}
                src={`${API}/blog/photo/${blog.slug}`}
                alt={blog.title}
              />
            </Link>
          </section>
        </div>
        <div className="col-md-8">
          <section>
            <div className="pb-3">{blog.excerpt}</div>
            <Link href={`blogs/${blog.slug}`}>
              <a className="btn btn-primary pt-2">Read more</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;

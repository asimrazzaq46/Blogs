import Head from "next/head";
import Link from "next/link";
import { Fragment, useState } from "react";
import { withRouter } from "next/router";
import moment from "moment";
import renderHtml from "react-render-html";

import Layout from "../../components/Layout";
import Card from "../../components/blog/Card";
import { singleBlog } from "../../actions/blog";
import { API, Domain, APP_NAME } from "../../config/config";

const singleBlogPage = ({ blog,asPath }) => {
  const head = () => {
    return (
      <Head>
        <title>
          {" "}
          {blog.title} | {APP_NAME}
        </title>
        <meta name="description" content={`${blog.mdesc}`} />
        <link rel="canonical" href={`${Domain}${asPath}`} />
        <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
        <meta
          property="og:description"
          content={blog.mdesc}
        />
        <meta property="og:type" content={`Website`} />
        <meta property="og:url" content={`${Domain}${asPath}`} />
        <meta property="og:site_name" content={`${APP_NAME}`} />

        <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
        <meta
          property="og:image:secure_url"
          content={`${API}/blog/photo/${blog.slug}`}
        />
        <meta property="og:image:type" content="image/jpg" />
      </Head>
    );
  };

  const showAllCategories = () => {
    return (
      blog.categories &&
      blog.categories.map((category, i) => (
        <Link href={`/categories/${category.slug}`}>
          <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
        </Link>
      ))
    );
  };

  const showAllTags = () => {
    return (
      blog.tags &&
      blog.tags.map((tag, i) => (
        <Link href={`/tags/${tag.slug}`}>
          <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
        </Link>
      ))
    );
  };

  return (
    <Fragment>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: "-30px" }}>
                  <img
                    src={`${API}/blog/photo/${blog.slug}`}
                    alt={`${blog.title}`}
                    className="img img-fluid feature-image"
                  />

                </div>
              </section>

              <section>
                <div className="container">
                  <h1 className="display-2 pb-3 text-center font-weight-bold">
                    {blog.title}
                  </h1>
                  <p className="mark mt-3">
                    {" "}
                    Written by {blog.postedBy?.name} | published{" "}
                    {moment(blog.updatedAt).fromNow()}
                  </p>
                  <div className="pb-3">
                    {showAllCategories()}
                    {showAllTags()}
                    <br />
                    <br />
                  </div>
                </div>
              </section>
            </div>
            <div>
              <div className="container">
                <section>
                  <div className="col-md-12 lead ">{renderHtml(blog.body)}</div>
                </section>
              </div>
              <div className="container pb-5">
                <h4 className="text-center pt-5 pb-5 h2">Related Blogs</h4>
                <hr />
                <p> Show Related Blogs</p>
              </div>
              <div className="container pb-5">
                <p> Show Comments</p>
              </div>
            </div>
          </article>
        </main>
      </Layout>
    </Fragment>
  );
};

singleBlogPage.getInitialProps = async ({ query,asPath }) => {
  const data = await singleBlog(query.slug);

  return {
    blog: data,
    asPath
    
  };
};

export default (singleBlogPage);

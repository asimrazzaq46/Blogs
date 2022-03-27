import Head from "next/head";
import Link from "next/link";
import { Fragment, useState } from "react";
import { withRouter } from "next/router";

import Layout from "../../components/Layout";
import Card from "../../components/blog/Card";
import { listBlogsCategoriesTags } from "../../actions/blog";
import { API, Domain, APP_NAME } from "../../config/config";
const Blogs = ({
  blogs,
  categories,
  tags,
  totalBlogs,
  router,
  blogsLimit,
  blogsSkip,
}) => {
  /////////////////////////////////////////// START //////////////////////
  //head of the page
  const head = () => {
    return (
      <Head>
        <title>Programming blogs | {APP_NAME}</title>
        <meta
          name="description"
          content="Programming blogs tuttorials on react node"
        />
        <link rel="canonical" href={`${Domain}${router.pathname}`} />
        <meta
          property="og:title"
          content={`latest web development tutorial | ${APP_NAME}`}
        />
        <meta
          property="og:description"
          content="Programming blogs tuttorials on react node"
        />
        <meta property="og:type" content={`Website`} />
        <meta property="og:url" content={`${Domain}${router.pathname}`} />
        <meta property="og:site_name" content={`${APP_NAME}`} />

        <meta property="og:image" content={`${Domain}/images/react.jpg`} />
        <meta
          property="og:image:secure_url"
          content={`${Domain}/images/react.jpg`}
        />
        <meta property="og:image:type" content="image/jpg" />
      </Head>
    );
  };

  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(blogsSkip);
  const [size, setsize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMore = async () => {
    let toSkip = skip + limit;
    const data = await listBlogsCategoriesTags(toSkip, limit);
    if (data.error) {
      console.log(`Error in load more blogs pages`, data.error);
    } else {
      setLoadedBlogs([...loadedBlogs, ...data.blogs]);
      setsize(data.size);
      setSkip(toSkip);
    }
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
          Load More
        </button>
      )
    );
  };

  const showLoadedBlogs = () => {
    return loadedBlogs.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
      </article>
    ));
  };

  //List All Blogs
  const showAllBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <article key={i}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };

  const showAllCategories = () => {
    return (
      categories &&
      categories.map((category, i) => (
        <Link key={i} href={`/categories/${category.slug}`}>
          <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
        </Link>
      ))
    );
  };

  const showAllTags = () => {
    return (
      tags &&
      tags.map((tag, i) => (
        <Link key={i} href={`/tags/${tag.slug}`}>
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
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Programming Blogs and Tutorials
                </h1>
              </div>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories()}

                  <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>

          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </Fragment>
  );
};

Blogs.getInitialProps = async () => {
  let skip = 0;
  let limit = 4;
  const data = await listBlogsCategoriesTags(skip, limit);
  if (data.error) {
    console.log(`error in blog Pages`, data.error);
  }

  const { blogs, categories, tags, size } = data;

  return {
    blogs,
    categories,
    tags,
    totalBlogs: size,
    blogsLimit: limit,
    blogsSkip: skip,
  };
};

export default withRouter(Blogs);

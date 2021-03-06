import Head from "next/head";
import { Fragment } from "react";

import Layout from "../../components/Layout";
import { singleCategory } from "../../actions/category";
import { Domain, APP_NAME } from "../../config/config";
import Card from "../../components/blog/Card";

const Categories = ({ category, blogs, error, asPath }) => {
  const head = () => {
    return (
      <Head>
        <title>
          {category.name} | {APP_NAME}
        </title>
        <meta
          name="description"
          content={`${category.name} on ${APP_NAME} website`}
        />
        <link rel="canonical" href={`${Domain}${asPath}`} />
        <meta property="og:title" content={`${category.name} | ${APP_NAME}`} />
        <meta
          property="og:description"
          content={`${category.name} on ${APP_NAME} website`}
        />
        <meta property="og:type" content={`Website`} />
        <meta property="og:url" content={`${Domain}${asPath}`} />
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
  const showError = () => {
    return (
      <p
        className="alert alert-warning pt-3 "
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </p>
    );
  };
  return (
    <Fragment>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{category.name}</h1>
                <hr />
                {showError()}
                {blogs?.map((blog, i) => (
                  <div>
                    <Card key={i} blog={blog} />
                    <hr />
                  </div>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </Fragment>
  );
};

Categories.getInitialProps = async ({ query, asPath }) => {
  const data = await singleCategory(query.slug);
  console.log(data);
  if (data.error) {
    return {
      error: data.error,
      category: data.category,
    };
  } else {
    return {
      category: data.category,
      blogs: data.blogs,
      asPath,
    };
  }
};

export default Categories;

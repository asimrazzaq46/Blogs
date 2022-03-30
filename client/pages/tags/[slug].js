import Head from "next/head";
import { Fragment } from "react";

import Layout from "../../components/Layout";
import { singleTag } from "../../actions/tag";
import { Domain, APP_NAME } from "../../config/config";
import Card from "../../components/blog/Card";

const Tags = ({ tag, blogs, asPath, error }) => {
  const head = () => {
    return (
      <Head>
        <title>
          {tag.name} | {APP_NAME}
        </title>
        <meta
          name="description"
          content={`${tag.name} on ${APP_NAME} website`}
        />
        <link rel="canonical" href={`${Domain}${asPath}`} />
        <meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
        <meta
          property="og:description"
          content={`${tag.name} on ${APP_NAME} website`}
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
                <h1 className="deisplay-4 font-weight-bold">{tag.name}</h1>
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

Tags.getInitialProps = async ({ query, asPath }) => {
  const data = await singleTag(query.slug);
  if (data.error) {
    return {
      error: data.error,
      tag: data.tag,
    };
  } else {
    return {
      tag: data.tag,
      blogs: data.blog,
      asPath,
    };
  }
};

export default Tags;

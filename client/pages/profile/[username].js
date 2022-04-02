import React, { Fragment } from "react";
import Head from "next/head";
import moment from "moment";

import Layout from "../../components/Layout";
import Link from "next/link";
import Private from "../../components/auth/Private";
import { API, Domain, APP_NAME } from "../../config/config";
import ContactForm from "../../components/contactForm/ContactForm";
import { userPublicProfile } from "../../actions/user";

const PublicProfile = ({ user, blogs, error, asPath }) => {
  console.log(user);
  const head = () => {
    return (
      <Head>
        <title>
          {user.name} | {APP_NAME}
        </title>
        <meta
          name="description"
          content={`${user.username} posted blogs on ${APP_NAME} website`}
        />
        <link rel="canonical" href={`${Domain}${asPath}`} />
        <meta property="og:title" content={`${user.username} | ${APP_NAME}`} />
        <meta
          property="og:description"
          content={`${user.username} posted blogs on ${APP_NAME} website`}
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

  const showUserBlogs = (blogs) => {
    if (blogs) {
      return blogs.map((blog, i) => (
        <div key={i} className="mt-4 mb-4">
          <Link href={`/blogs/${blog.slug}`}>
            <a className="lead">{blog.title}</a>
          </Link>
        </div>
      ));
    }
    if (error) {
      return <p>{error}</p>;
    }
  };

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5>{user.name}</h5>

                      <p className="text-muted">
                        Joined {moment(user.createdAt).fromNow()}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <img
                        className="img img-fluid img-thumbnail mb-3"
                        src={`${API}/profile/photo/${user.username}`}
                        style={{ maxHeight: "200px", maxWidth: "100%" }}
                        alt={`${user.name} profile photo`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="container pb-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  {" "}
                  <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-light">
                    Recent Blogs by {user.name}
                  </h5>
                  <p>{showUserBlogs(blogs)}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-light">
                    Message {user.name}
                  </h5>
                  <br />
                  <p>
                    <ContactForm AuthorEmail={user.email} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

PublicProfile.getInitialProps = async ({ query, asPath }) => {
  const data = await userPublicProfile(query.username);
  if (data.error) {
    return {
      asPath,
      user: data.user,
      error: data.error,
    };
  }
  return {
    user: data.user,
    blogs: data.blogs,
    asPath,
  };
};

export default PublicProfile;

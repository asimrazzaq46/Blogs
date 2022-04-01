import { Fragment } from "react";
import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import BlogRead from "../../../components/crud/BlogRead";
import { isAuth } from "../../../actions/auth";

const blogs = () => {
  const username = isAuth() && isAuth().username;
  return (
    <Fragment>
      <Layout>
        <Private>
          <div className="row">
            <div className="col-md-12 text-center pt-5 pb-5">
              <h2>Manage Blog</h2>
            </div>
            <div className="col-md-12">
              <BlogRead username={username} />
            </div>
          </div>
        </Private>
      </Layout>
    </Fragment>
  );
};

export default blogs;

import { Fragment } from "react";
import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import BlogCreate from "../../../components/crud/BlogCreate";

const create = () => {
  return (
    <Fragment>
      <Layout>
        <Private>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 text-center pt-5 pb-5">
                <h2>Create Blog</h2>
              </div>
              <div className="col-md-12">
                <p>Blog</p>
                <BlogCreate />
              </div>
            </div>
          </div>
        </Private>
      </Layout>
    </Fragment>
  );
};

export default create;

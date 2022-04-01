import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import BlogUpdate from "../../../components/crud/BlogUpdate";

const updateBlog = () => {
  return (
    <div>
      <Layout>
        <Private>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 text-center pt-5 pb-5">
                <h2>Update Blog</h2>
              </div>
              <div className="col-md-12">
                <p>Blog</p>
                <BlogUpdate />
              </div>
            </div>
          </div>
        </Private>
      </Layout>
    </div>
  );
};

export default updateBlog;

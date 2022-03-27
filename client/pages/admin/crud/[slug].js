import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import BlogUpdate from "../../../components/crud/BlogUpdate";

const updateBlog = () => {
  return (
    <div>
      <Layout>
        <Admin>
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
        </Admin>
      </Layout>
    </div>
  );
};



export default updateBlog;

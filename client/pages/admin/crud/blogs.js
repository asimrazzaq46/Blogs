import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import BlogRead from "../../../components/crud/BlogRead";

const blogs = () => {
  return (
    <div>
      <Layout>
        <Admin>
          <div className="row">
            <div className="col-md-12 text-center pt-5 pb-5">
              <h2>Manage Blog</h2>
            </div>
            <div className="col-md-12">
              <BlogRead />
            </div>
          </div>
        </Admin>
      </Layout>
    </div>
  );
};

export default blogs;

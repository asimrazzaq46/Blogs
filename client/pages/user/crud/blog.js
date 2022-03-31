import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import BlogCreate from "../../../components/crud/BlogCreate";
const userCreateblog = () => {
  return (
    <div>
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
    </div>
  );
};

export default userCreateblog;

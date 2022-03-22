import Layout from "../../../components/Layout";
import Link from "next/link";
import Admin from "../../../components/auth/Admin";
import BlogCreate from "../../../components/crud/BlogCreate";
const blog = () => {
  return (
    <div>
      <Layout>
        <Admin>
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
        </Admin>
      </Layout>
    </div>
  );
};

export default blog;

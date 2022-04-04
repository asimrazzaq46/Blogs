import Layout from "../../components/Layout";
import Link from "next/link";
import Admin from "../../components/auth/Admin";

const adminindex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 text-center pt-5 pb-5">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="col-md-2"></div>
            <div className="col-md-8  d-flex justify-content-center " >
              <ul className="list-group d-flex justify-content-center">
                <li className="list-group-item list-border d-flex justify-content-center">
                  <Link href="/admin/crud/category-tag">
                    <a>Create Category And Tags</a>
                  </Link>
                </li>

                <li className="list-group-item list-border d-flex justify-content-center">
                  <Link href="/admin/crud/blog">
                    <a>Create Blog</a>
                  </Link>
                </li>
                <li className="list-group-item list-border d-flex justify-content-center">
                  <Link href="/admin/crud/blogs">
                    <a>Update/Delete Blog</a>
                  </Link>
                </li>
                <li className="list-group-item list-border d-flex justify-content-center">
                  <Link href="/user/update">
                    <a>Update Profile</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default adminindex;

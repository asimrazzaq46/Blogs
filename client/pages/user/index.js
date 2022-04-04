import Layout from "../../components/Layout";
import Link from "next/link";
import Private from "../../components/auth/Private";

const userindex = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 text-center pt-5 pb-5">
              <h2>User Dashboard</h2>
            </div>
            <div className="col-md-2"></div>
            <div className="col-md-8 d-flex justify-content-center ">
              <ul className="list-group">
                <li className="list-group-item list-border d-flex justify-content-center">
                  <Link href="/user/crud/create">
                    <a>Create Blog</a>
                  </Link>
                </li>
                <li className="list-group-item list-border d-flex justify-content-center">
                  <Link href="/user/crud/blogs">
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
      </Private>
    </Layout>
  );
};

export default userindex;

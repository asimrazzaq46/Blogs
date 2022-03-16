import Layout from "../components/Layout";
import Link from "next/link";
import SigninComponent from "../components/auth/SigninComponent";

const signin = () => {
  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">Sign in</h2>
      <div className="row">
        <div className="col-md-4 offset-md-4">
      <SigninComponent />
         
        </div>
      </div>
    </Layout>
  );
};

export default signin;

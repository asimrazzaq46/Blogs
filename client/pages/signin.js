import Layout from "../components/Layout";
import { withRouter } from "next/router";
import SigninComponent from "../components/auth/SigninComponent";

const signin = ({ router }) => {
  const showRedirectMessage = () => {
    if (router.query.message) {
      return <div className="alert alert-danger">{router.query.message}</div>;
    }else{
      return
    }
  };

  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">Sign in</h2>
      <div className="row">
        <div className="col-md-4 offset-md-4">
          {showRedirectMessage()}
        
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 offset-md-4">
        
          <SigninComponent />
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(signin);

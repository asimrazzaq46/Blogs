import React, { Fragment } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import Private from "../../components/auth/Private";
import ProfileUpdate from "../../components/auth/ProfileUpdate";
const update = () => {
  return (
    <Fragment>
      <Layout>
        <Private>
          <div className="container">
            <div className="row">
              <ProfileUpdate />
            </div>
          </div>
        </Private>
      </Layout>
    </Fragment>
  );
};

export default update;

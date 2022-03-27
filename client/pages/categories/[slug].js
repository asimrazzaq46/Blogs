import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import { withRouter } from "next/router";
import moment from "moment";

import Layout from "../../components/Layout";
import { getCategories, singleCategory } from "../../actions/category";
import { API, Domain, APP_NAME } from "../../config/config";

const Categories = ({ categories }) => {
  return (
    <Fragment>
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">
                  {categories.name}
                </h1>
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </Fragment>
  );
};

Categories.getInitialProps = async ({ query }) => {
  const data = await singleCategory(query.slug);
  if (data.error) {
    console.log(`error in initial props category slug`, data.error);
  } else {
    return {
      categories: data,
    };
  }
};

export default Categories;

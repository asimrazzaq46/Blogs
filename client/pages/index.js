import Layout from "../components/Layout";
import Link from "next/link";

const index = () => {
  return (
    <Layout>
      <h2>hello next.js</h2>
      <Link href="/signup">
        <a>SignUp</a>
      </Link>
    </Layout>
  );
};

export default index;

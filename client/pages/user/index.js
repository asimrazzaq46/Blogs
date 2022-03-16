import Layout from "../../components/Layout";
import Link from "next/link";
import Private from "../../components/auth/Private";

const userindex = () => {
  return (
    <Layout>
      <Private >User Dashboard</Private>
    </Layout>
  );
};

export default userindex;

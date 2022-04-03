import Layout from "../components/Layout";
import Link from "next/link";
import ContactForm from "../components/contactForm/ContactForm";

const index = () => {
  return (
    <Layout>
      <div className='container-fluid'>
        <div className='row'>

    <div className='col-md-8 offset-md-2'>
        <h2>Contact Form</h2>
<hr/>
<ContactForm />
    </div>
        </div>
      </div>
    </Layout>
  );
};

export default index;
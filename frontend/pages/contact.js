import Layout from '../components/Layout';
import React from 'react';
import ContactForm from '../components/form/ContactForm';
import 'bootstrap/dist/css/bootstrap.css';

const Contact = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h2 className="mt-4">Register Form</h2>
            <p>(*title of competition && something about you)</p>
            <hr />
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

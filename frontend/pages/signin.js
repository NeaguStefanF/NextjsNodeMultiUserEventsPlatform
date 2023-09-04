import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { withRouter } from 'next/router';
import SigninComponent from '../components/auth/SigninComponent';
import 'bootstrap/dist/css/bootstrap.css';

import styles from './form.module.css';

const Signin = ({ router }) => {
  const [redirectMessage, setRedirectMessage] = useState('');

  useEffect(() => {
    if (router.query.message) {
      setRedirectMessage(router.query.message);

      // Remove the message after 10 seconds
      const timer = setTimeout(() => {
        setRedirectMessage('');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [router.query.message]);

  const showRedirectMessage = () => {
    if (redirectMessage) {
      return <div className="alert alert-danger">{redirectMessage}</div>;
    }
  };

  return (
    <Layout>
      <div className="container">
        <h2 className="text-center pt-4 pb-4">Signin page</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">{showRedirectMessage()}</div>
        </div>
        <div className="row justify-content-center">
          <div className={`col-md-6 ${styles['signin-form-container']}`}>
            <SigninComponent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Signin);

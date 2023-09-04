import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import ReadComunity from '../../../components/comunity/ReadComunity';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

const Comunities = () => {
  return (
    <Layout>
      <Admin>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Feedback Posts</h2>
            </div>
            <div className="col-md-12">
              <ReadComunity />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default Comunities;

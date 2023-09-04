import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import ReadComunity from '../../../components/comunity/ReadComunity';
import React from 'react';
import Link from 'next/link';
import { isAuth } from '../../../actions/auth';
import 'bootstrap/dist/css/bootstrap.css';

const Comunities = () => {
  const username = isAuth() && isAuth().username;
  return (
    <Layout>
      <Private>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Feedback Posts</h2>
            </div>
            <div className="col-md-12">
              <ReadComunity username={username} />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default Comunities;

import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import ReadPost from '../../../components/crud/ReadPost';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

const Posts = () => {
  return (
    <Layout>
      <Admin>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Events</h2>
            </div>
            <div className="col-md-12">
              <ReadPost />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default Posts;

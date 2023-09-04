import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import CreatePost from '../../../components/crud/CreatePost';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

const Posts = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Create Event</h2>
            </div>
            <div className="col-md-12">
              <CreatePost />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default Posts;

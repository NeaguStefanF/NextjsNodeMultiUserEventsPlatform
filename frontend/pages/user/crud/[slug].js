import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import UpdatePost from '../../../components/crud/UpdatePost';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

const Posts = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Update Post</h2>
            </div>
            <div className="col-md-12">
              <UpdatePost />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default Posts;

import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import CreatePost from '../../../components/crud/CreatePost';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

const CreatePosts = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div
              style={{ paddingRight: '60px', paddingLeft: '60px' }}
              className="col-md-12 pt-5 pb-5"
            >
              <h2>Create New Posts</h2>
            </div>
            <div className="col-md-12">
              <CreatePost />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default CreatePosts;

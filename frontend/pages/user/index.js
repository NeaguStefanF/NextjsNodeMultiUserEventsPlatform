import Layout from '../../components/Layout';
import Private from '../../components/auth/Private';
import React from 'react';
import Link from 'next/link';

import 'bootstrap/dist/css/bootstrap.css';

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <div
          style={{ paddingRight: '60px', paddingLeft: '60px' }}
          className="container-fluid"
        >
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Private Dashboard</h2>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="card-header mb-3">
                    <h4>Manage your APP</h4>
                  </div>
                  <div className="list-group">
                    {/* <Link
                      className="list-group-item list-group-item-action list-group-item-info"
                      href="/user/crud/posts"
                    >
                      Create a new Post
                    </Link>

                    <Link
                      className="list-group-item list-group-item-action list-group-item-info"
                      href="/user/crud/allposts"
                    >
                      Update/Delete Posts
                    </Link> */}

                    <Link
                      className="list-group-item list-group-item-action list-group-item-info"
                      href="/user/crudd/listcomunityposts"
                    >
                      Update/Delete Feedback Posts
                    </Link>

                    <Link
                      className="list-group-item list-group-item-action list-group-item-warning"
                      href="/user/update"
                    >
                      Update Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 text-white">
              <div className="card bg-info">
                <div className="card-body">
                  <h4 className="card-title">Welcome!</h4>
                  <p>UPDATE | REMOVE your feedback posts</p>
                  <p>EDIT your profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserIndex;

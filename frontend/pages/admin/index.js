import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div
          style={{ paddingRight: '60px', paddingLeft: '60px' }}
          className="container-fluid"
        >
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="card-header mb-3">
                    <h4>Manage APP</h4>
                  </div>
                  <div className="list-group">
                    <Link
                      className="list-group-item list-group-item-action list-group-item-info "
                      href="/admin/crud/category-tag"
                    >
                      Create/Delete Category
                    </Link>

                    <Link
                      className="list-group-item list-group-item-action list-group-item-info"
                      href="/admin/crud/category-tag"
                    >
                      Create/Delete Tag
                    </Link>

                    <Link
                      className="list-group-item list-group-item-action list-group-item-info"
                      href="/admin/crud/posts"
                    >
                      Create a new Event
                    </Link>

                    <Link
                      className="list-group-item list-group-item-action list-group-item-info"
                      href="/admin/crud/allposts"
                    >
                      Update/Delete Events
                    </Link>

                    <Link
                      className="list-group-item list-group-item-action list-group-item-info"
                      href="/admin/crudd/listcomunityposts"
                    >
                      Update/Delete Feedback Posts
                    </Link>

                    <Link
                      className="list-group-item list-group-item-action list-group-item-warning"
                      href="/user/update"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 text-white">
              <div className="card bg-info">
                <div className="card-body">
                  <h4 className="card-title">Welcome!</h4>
                  <p className="card-text">Manage Panel for Admin account:</p>
                  <p className="card-text">ADD | REMOVE Categories and Tags</p>
                  <p>CREATE | UPDATE | REMOVE events</p>
                  <p>UPDATE | REMOVE feedback posts</p>
                  <p>EDIT your profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;

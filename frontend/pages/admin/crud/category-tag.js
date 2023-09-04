import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import Category from '../../../components/crud/Category';
import Tag from '../../../components/crud/Tag';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

const CategoryTag = () => {
  return (
    <Layout>
      <Admin>
        <div
          style={{ paddingRight: '60px', paddingLeft: '60px' }}
          className="container-fluid"
        >
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Categories and Tags</h2>
              <h3 className="lead">(*Double click to delete items)</h3>
            </div>
            <div className="col-md-6">
              <Category />
            </div>
            <div className="col-md-6">
              <Tag />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default CategoryTag;

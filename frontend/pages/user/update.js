import Layout from '../../components/Layout';
import Private from '../../components/auth/Private';
import React from 'react';
import Link from 'next/link';
import ProfileUpdate from '../../components/auth/ProfileUpdate';
import 'bootstrap/dist/css/bootstrap.css';

const UserProfileUpdate = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row justify-content-center">
            <ProfileUpdate />
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserProfileUpdate;

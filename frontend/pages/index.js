import Layout from '../components/Layout';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';

const Index = () => {
  return (
    <Layout>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1
              style={{ fontWeight: '400', color: '#333' }}
              className="display-4 font-weight-bold text-center mt-4"
            >
              Welcome to the Concursul Web APP! (v.1.0.1)
            </h1>
            <h2
              style={{ fontWeight: '300', color: '#333' }}
              className="display-5 font-weight-bold text-center mt-4"
            >
              BETA VERSION (will be added new style(Tailwind Css) and other
              missing functionalities)
            </h2>
            <p style={{ color: '#333' }}>
              Sign in to gain full access to the Concursul APP. This web app
              application exists to connect students, mentors, and schools in
              every community to a variety of successful and engaging
              technology-based programs. Our goal is to provide these programs
              with services, solutions, and a community that allows them to
              flourish in a way that fosters the technical and interpersonal
              skills necessary for students to succeed in the 21st Century.
              Whether it's a competitive event, workshop, camp, or conference,
              we understand the unprecedented level of passion and commitment it
              takes to create, maintain, and execute such programs. Our web app
              aims to support and enhance these initiatives.
            </p>

            <Link href="/signin">
              <span className="btn btn-primary btn-lg">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

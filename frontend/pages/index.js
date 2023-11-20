import Layout from '../components/Layout';
import React from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';
import { isAuth } from '../actions/auth';

const Index = () => {
  return (
    <Layout>
      <article className="overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1
                style={{ fontWeight: '400', color: '#333' }}
                className="display-4 font-weight-bold text-center mt-4"
              >
                Welcome to the Concursul Web APP! (v.1.0.2)
              </h1>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center pt-4 pb-5">
              <p className="lead">
                Concursul exists to connect students, mentors, and schools in
                every community to a variety of successful and engaging
                technology-based programs.
              </p>
              {!isAuth() && (
                <div>
                  <p style={{ color: '#333' }}>
                    Sign in to gain full access to the Concursul APP.
                  </p>
                  <Link href="/signin">
                    <span className="btn btn-primary btn-lg">Sign in</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="flip flip-horizontal">
                <div
                  className="front"
                  style={{
                    backgroundImage:
                      'url(' +
                      'https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg' +
                      ')',
                  }}
                >
                  <h2 className="text-shadow text-center h1">Comunity</h2>
                </div>
                <div className="back text-center">
                  <Link href="/comunity">
                    <h3 className="h3">{`Go to page ->`}</h3>
                  </Link>
                  <p className="lead">
                    Interact with users that are using this page.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="flip flip-horizontal">
                <div
                  className="front"
                  style={{
                    backgroundImage:
                      'url(' +
                      'https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg' +
                      ')',
                  }}
                >
                  <h2 className="text-shadow text-center h1">
                    Events/Competitions
                  </h2>
                </div>
                <div className="back text-center">
                  <Link href="/posts">
                    <h3 className="h3">{`Go to page ->`}</h3>
                  </Link>
                  <p className="lead">
                    Dont miss any hackatons or fun events that will be posted
                    here!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default Index;

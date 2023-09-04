import Head from 'next/head';
import Link from 'next/link';
import moment from 'moment';
import React from 'react';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { isAuth } from '../../actions/auth';
import { userPublicProfile } from '../../actions/user';
import { listcomunityposts } from '../../actions/comunity';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import ContactForm from '../../components/form/ContactForm';
import 'bootstrap/dist/css/bootstrap.css';

const UserProfile = ({ auth, posts, query, username }) => {
  const head = () => (
    <Head>
      <title>
        {auth.username} | {APP_NAME}
      </title>
      <meta name="description" content={`Posts by ${auth.username}`} />
      <link rel="canonical" href={`${DOMAIN}/profile/${query.username}`} />
      <meta property="og:title" content={`${auth.username} | ${APP_NAME}`} />
      <meta property="og:description" content={`Posts by ${auth.username}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/profile/${query.username}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${DOMAIN}/static/images/ok.jpg`} />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/images/ok.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const [comunity, setComunity] = useState([]);
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    listcomunityposts(username).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setComunity(data);
      }
    });
  };
  //function look thro user posts
  const showUserPosts = () => {
    return posts.map((posts, i) => {
      return (
        <div className="mt-4 mb-4" key={i}>
          <Link href={`/posts/${posts.slug}`}>
            <span className="btn btn-primary">{posts.title}</span>
          </Link>
        </div>
      );
    });
  };

  const showAllPosts = () => {
    if (!comunity) {
      return null;
    }
    const userComunityPosts = comunity.filter(
      (post) => post.postedBy.username === auth.username
    );
    return userComunityPosts.map((comunity, i) => {
      return (
        <div key={i} className="mt-4 mb-4">
          <Link href={`/comunity`}>
            <span className="btn btn-outline-primary">{comunity.title}</span>
          </Link>
          <h3></h3>
        </div>
      );
    });
  };

  return (
    <>
      {head()}
      <Layout>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card mt-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-1">
                      <img
                        src={`${API}/user/photo/${auth.username}`}
                        className="img img-fluid rounded-pill rounded mb-3"
                        style={{ maxHeight: '100px', maxWidth: '100px' }}
                        alt="user profile photo"
                      />
                    </div>
                    <div className="col-md-11">
                      <h4>{auth.name}</h4>
                      <span className="badge bg-info text-dark mb-3">
                        {auth.about}
                      </span>

                      {/* <p className="text-muted">
                        Joined {moment(auth.updatedAt).fromNow()}
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="container pb-5">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4 text-light text-center">
                    Recent posts by {auth.name}
                  </h5>
                  {showUserPosts()}
                  {showAllPosts()}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title bg-secondary pt-4 pb-4 pl-4 pr-4 text-light text-center">
                    Message {auth.name}
                  </h5>
                  <br />
                  <ContactForm authorEmail={auth.email} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

UserProfile.getInitialProps = ({ query }) => {
  return userPublicProfile(query.username).then((data) => {
    if (data && data.error) {
      console.log(data.error);
    } else {
      return { auth: data.auth, posts: data.posts, query };
    }
  });
};

export default UserProfile;

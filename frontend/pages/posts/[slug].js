import Head from 'next/head';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import React from 'react';
import Layout from '../../components/Layout';
import SmallCard from '../../components/posts/SmallCard';
import { useState, useEffect } from 'react';
import { singlePost, listRelated } from '../../actions/posts';
import { isAuth } from '../../actions/auth';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import DisqusThread from '../../components/DisqusThread';

import 'bootstrap/dist/css/bootstrap.css';

const SinglePost = ({ posts, query }) => {
  const [related, setRelated] = useState([]);

  const loadRelated = () => {
    listRelated({ posts }).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  useEffect(() => {
    loadRelated();
  }, []);

  const head = () => (
    <Head>
      <title>
        {posts.title} | {APP_NAME}
      </title>
      <meta name="description" content={posts.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/posts/${query.slug}`} />
      <meta property="og:title" content={`${posts.title} | ${APP_NAME}`} />
      <meta property="og:title" content={posts.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/posts/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta
        property="og:image"
        content={`${DOMAIN}/posts/photo/${posts.slug}`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/posts/photo/${posts.slug}`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );
  const showPostsCategories = (posts) => {
    return posts.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <span
          style={{ marginRight: '5px', marginLeft: '5px' }}
          className="btn btn-primary mr-1 ml-1 mt-3"
        >
          {c.name}
        </span>
      </Link>
    ));
  };

  const showPostsTags = (posts) => {
    return posts.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <span
          style={{ marginRight: '5px', marginLeft: '5px' }}
          className="btn btn-outline-primary mr-1 ml-1 mt-3"
        >
          {t.name}
        </span>
      </Link>
    ));
  };

  const showRelatedPosts = () => {
    return related.map((posts, i) => {
      return (
        <div className="col-md-4" key={i}>
          <article>
            <SmallCard posts={posts} />
          </article>
        </div>
      );
    });
  };

  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={posts.id}
          title={posts.title}
          path={`/posts/${posts.slug}`}
        />
      </div>
    );
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row">
                  <img
                    style={{
                      width: '100%',
                      maxHeight: '500px',
                      objectFit: 'cover',
                      margin: 0,
                      padding: 0,
                    }}
                    src={`${API}/posts/photo/${posts.slug}`}
                    alt={posts.title}
                    className="img img-fluid featured-image"
                  />
                </div>
              </section>

              <section>
                <div className="container">
                  <h1 className="display-1 pb-3 pt-3 text-center font-weight-bold">
                    {posts.title}
                  </h1>
                  <p className="lead mt-3 mark">
                    Written by{' '}
                    <Link href={`/profile/${posts.postedBy.username}`}>
                      <span className="badge text-bg-primary">
                        {posts.postedBy.username}
                      </span>
                    </Link>{' '}
                    | Published {moment(posts.updatedAt).fromNow()}
                  </p>

                  <div className="pb-3">
                    {showPostsCategories(posts)}
                    {showPostsTags(posts)}
                    <br />
                    <br />
                  </div>
                </div>
              </section>
            </div>

            <div className="container">
              <section>
                <div className="col-md-12 lead">{renderHTML(posts.body)}</div>
              </section>
            </div>

            <div className="container col-md-8 bg-info">
              <div className="row justify-content-center">
                <h4 className="text-center pt-5 pb-3 h2 text-white">
                  Register Here
                </h4>
                <p className="text-center text-white">
                  Registration to participate in this competition "{posts.title}
                  "
                </p>
                <div className="col-md-4 pt-2 pb-5">
                  {isAuth() && (
                    <Link href="/contact">
                      <span
                        style={{ padding: '16px', width: '100%' }}
                        className="btn btn-outline-light"
                        type="submit"
                      >
                        Register
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-center pt-5 pb-3 h1 text-dark">OR</h2>

            <div className="container col-md-8 bg-info">
              <div className="row justify-content-center">
                <h4 className="text-center pt-5 pb-3 h2 text-white">
                  Contact to Register
                </h4>

                <p className="text-center text-white">
                  Contact the author of this event "{posts.title}" to Register.
                </p>
                <div className="col-md-4 pt-2 pb-5">
                  {isAuth() && (
                    <Link href={`/profile/${posts.postedBy.username}`}>
                      <span
                        style={{ padding: '16px', width: '100%' }}
                        className="btn btn-outline-light"
                      >
                        {posts.postedBy.username}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2"> Related posts</h4>
              <hr />
              <div className="row">{showRelatedPosts()}</div>
            </div>
            {isAuth() && <div className="container pb-5">{showComments()}</div>}
          </article>
        </main>
      </Layout>
    </>
  );
};

SinglePost.getInitialProps = ({ query }) => {
  return singlePost(query.slug).then((data) => {
    if (data && data.error) {
      console.log(data.error);
    } else {
      return { posts: data, query };
    }
  });
};

export default SinglePost;

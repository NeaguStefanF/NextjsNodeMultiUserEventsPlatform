import Layout from '../components/Layout';
import Head from 'next/head';
import React from 'react';
import Comunity from '../components/comunity/Comunity';
import ComunityList from '../components/comunity/ComunityList';
import { withRouter } from 'next/router';
import { useState } from 'react';
import { isAuth } from '../actions/auth';
import { list } from '../actions/comunity';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../config';
import 'bootstrap/dist/css/bootstrap.css';

const ComunityPage = ({
  comunity,
  totalPosts,
  postsLimit,
  postsSkip,
  router,
  query,
}) => {
  const head = () => (
    <Head>
      <title>
        {comunity.title} | {APP_NAME}
      </title>
      <meta name="description" content={comunity.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/comunity/${query.slug}`} />
      <meta property="og:title" content={`${comunity.title} | ${APP_NAME}`} />
      <meta property="og:title" content={comunity.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/comunity/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta
        property="og:image"
        content={`${DOMAIN}/comunity/photo/${comunity.slug}`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/comunity/photo/${comunity.slug}`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );
  const [limit, setLimit] = useState(postsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalPosts);
  const [loadedPosts, setLoadedPosts] = useState([]);

  const showLoadedPosts = () => {
    return loadedPosts.map((comunity, i) => {
      return (
        <article key={i}>
          <ComunityList comunity={comunity} />
        </article>
      );
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    list(toSkip, limit).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setLoadedPosts([...loadedPosts, ...data.comunity]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-dark btn-lg">
          Load more...
        </button>
      )
    );
  };

  const showAllPosts = () => {
    return comunity.map((comunity, i) => {
      return (
        <article key={i}>
          <ComunityList comunity={comunity} />
        </article>
      );
    });
  };

  return (
    <>
      {head()}
      <Layout>
        <div className="container">
          <h2
            style={{ fontWeight: '400' }}
            className="display-4 font-weight-bold text-center pt-4  mt-4"
          >
            Feedback Page Content
          </h2>
          <p className="text-center mb-4">(*photos winners feedback)</p>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <Comunity />
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8">
              <p className="text-center mt-5">(Content Comunity)</p>
            </div>
            <div className="col-md-8">{showAllPosts()}</div>
            <div className="col-md-8 ">{showLoadedPosts()}</div>
            <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
          </div>
        </div>
      </Layout>
    </>
  );
};

ComunityPage.getInitialProps = ({ query }) => {
  let skip = 0;
  let limit = 2;
  return list(skip, limit).then((data) => {
    if (data && data.error) {
      console.log(data.error);
    } else {
      return {
        comunity: data.comunity || [], // Handle if `data.comunity` is null or undefined
        totalPosts: data.size || 0, // Provide a default value for `data.size` if needed
        postsLimit: limit,
        postsSkip: skip,
        query,
      };
    }
  });
};

export default withRouter(ComunityPage);

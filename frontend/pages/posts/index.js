import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listAllPostsCategoriesTags } from '../../actions/posts';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import Card from '../../components/posts/Card';
import 'bootstrap/dist/css/bootstrap.css';

const Posts = ({
  posts,
  categories = [],
  tags = [],
  totalPosts,
  postsLimit,
  postsSkip,
  router,
}) => {
  const head = () => (
    <Head>
      <title>Concursuri si Competitii educationale | {APP_NAME}</title>
      <meta
        name="description"
        content="Web app realizat in nextjs:frontend nodejs:backend"
      />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`Just a web app | ${APP_NAME}`} />
      <meta
        property="og:title"
        content="Just a web app created in nextjs nodejs mongodb for studying"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
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

  const [limit, setLimit] = useState(postsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalPosts);
  const [loadedPosts, setLoadedPosts] = useState([]);

  const showLoadedPosts = () => {
    return loadedPosts.map((posts, i) => {
      return (
        <article key={i}>
          <Card posts={posts} />
        </article>
      );
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    listAllPostsCategoriesTags(toSkip, limit).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setLoadedPosts([...loadedPosts, ...data.posts]);
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
    return posts.map((posts, i) => {
      return (
        <article key={i}>
          <Card posts={posts} />
          <hr />
        </article>
      );
    });
  };
  return (
    <>
      {head()}
      <Layout>
        <main style={{ paddingRight: '10px', paddingLeft: '10px' }}>
          <div className="container-fluid">
            <header>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories(categories)}
                  <br />
                  {showAllTags(tags)}
                </div>
              </section>
              <div className="col-md-12 pt-5 pb-5">
                <h1
                  style={{ fontWeight: '400' }}
                  className="display-4 font-weight-bold text-center"
                >
                  Concursuri/Competitii
                </h1>
              </div>
            </header>
          </div>
          <div className="container-fluid col-md-10">{showAllPosts()}</div>
          <div className="container-fluid col-md-10">{showLoadedPosts()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </>
  );
};

const showAllCategories = (categories) => {
  return categories.map((c, i) => (
    <Link href={`/categories/${c.slug}`} key={i}>
      <span
        style={{ marginRight: '5px', marginLeft: '5px' }}
        className="btn btn-dark mr-1 ml-1 mt-3 btn-lg"
      >
        {c.name}
      </span>
    </Link>
  ));
};

const showAllTags = (tags) => {
  return tags.map((t, i) => (
    <Link href={`/tags/${t.slug}`} key={i}>
      <span
        style={{ marginRight: '5px', marginLeft: '5px' }}
        className="btn btn-outline-dark mr-1 ml-1 mt-3 "
      >
        {t.name}
      </span>
    </Link>
  ));
};

Posts.getInitialProps = () => {
  let skip = 0;
  let limit = 2;
  return listAllPostsCategoriesTags(skip, limit).then((data) => {
    if (data && data.error) {
      console.log(data.error);
    } else {
      return {
        posts: data.posts || [], // Handle if `data.posts` is null or undefined
        categories: data.categories || [],
        tags: data.tags || [],
        totalPosts: data.size || 0, // Provide a default value for `data.size` if needed
        postsLimit: limit,
        postsSkip: skip,
      };
    }
  });
};

export default withRouter(Posts);

//getInitialProps - runs on server side - get the response from the server -then render on page - full serverside render
// can be used only on pages

import Head from 'next/head';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import React from 'react';
import Layout from '../../components/Layout';
import { singleTag } from '../../actions/tag';
import {
  API,
  DOMAIN,
  APP_NAME,
  FB_APP_ID,
} from '../../config';
import Card from '../../components/posts/Card';
import 'bootstrap/dist/css/bootstrap.css';

const Tag = ({ tag, posts, query }) => {
  const head = () => (
    <Head>
      <title>{`${tag.name} | ${APP_NAME}`}</title>

      <meta
        name="description"
        content={`Just a title for my type of post ${tag.name}`}
      />
      <link
        rel="canonical"
        href={`${DOMAIN}/tag/${query.slug}`}
      />
      <meta
        property="og:title"
        content={`${tag.name} | ${APP_NAME}`}
      />
      <meta
        property="og:title"
        content={`Just a title for my type of post ${tag.name}`}
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:site_name"
        content={`${APP_NAME}`}
      />

      <meta
        property="og:image"
        content={`${DOMAIN}/static/images/ok.jpg`}
      />
      <meta
        property="og:image:secure_url"
        content={`${DOMAIN}/static/images/ok.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1
                  style={{ fontWeight: '400' }}
                  className="display-4 font-weght-bold mt-5 mb-5"
                >
                  {tag.name}
                </h1>
                {posts.map((p, i) => (
                  <div>
                    <Card key={i} posts={p} />
                    <hr />
                  </div>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </>
  );
};

// Tag.getInitialProps = ({ query }) => {
//   return singleTag(query.slug).then((data) => {
//     if (data && data.error) {
//       console.log(data.error);
//     } else {
//       return { tag: data.tag, posts: data.posts, query };
//     }
//   });
// };

export async function getServerSideProps({ query }) {
  const data = await singleTag(query.slug);

  if (data && data.error) {
    console.log(data.error);
    return {
      props: {
        tag: {},
        posts: [],
        query,
      },
    };
  }

  return {
    props: {
      tag: data.tag || {},
      posts: data.posts || [],
      query,
    },
  };
}

export default Tag;

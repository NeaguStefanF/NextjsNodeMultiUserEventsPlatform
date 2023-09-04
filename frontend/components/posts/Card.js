import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API } from '../../config';
import 'bootstrap/dist/css/bootstrap.css';

const Card = ({ posts }) => {
  const showPostsCategories = (posts) => {
    return posts.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <span
          style={{ marginRight: '5px', marginLeft: '5px' }}
          className="btn btn-dark mr-1 ml-1 mt-3"
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
          className="btn btn-outline-dark mr-1 ml-1 mt-3"
        >
          {t.name}
        </span>
      </Link>
    ));
  };

  return (
    <div className="lead pb-4">
      <header>
        <Link
          style={{ textDecoration: 'none !important', color: 'inherit' }}
          href={`/posts/${posts.slug}`}
        >
          <h2 className="pb-3 pt-5 font-weight-bold">{posts.title}</h2>
        </Link>
      </header>
      <section>
        <p className="mark ml-1 pt-2 pb-2">
          Written by{' '}
          <Link href={`/profile/${posts.postedBy.username}`}>
            <span className="badge text-bg-primary">
              {posts.postedBy.username}
            </span>
          </Link>{' '}
          | Published {moment(posts.updatedAt).fromNow()}
        </p>
      </section>
      <section>
        {showPostsCategories(posts)}
        {showPostsTags(posts)}
        <br />
        <br />
      </section>
      <div className="row">
        <div className="col-md-4">
          <section>
            <img
              className="img img-fluid"
              style={{ maxHeight: 'auto', width: '100%' }}
              src={`${API}/posts/photo/${posts.slug}`}
              alt={posts.title}
            />
          </section>
        </div>
        <div className="col-md-8">
          <section>
            <div className="pb-3">{renderHTML(posts.excerpt)}</div>
            <Link href={`/posts/${posts.slug}`}>
              <span className="btn btn-primary pb-2 btn-lg">Read more</span>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;

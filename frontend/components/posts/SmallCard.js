import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API } from '../../config';
import 'bootstrap/dist/css/bootstrap.css';

const SmallCard = ({ posts }) => {
  return (
    <div className="card shadow p-3 mb-5 bg-body rounded">
      <section>
        <Link href={`/posts/${posts.slug}`}>
          <img
            className="img img-fluid"
            style={{ height: '250px', width: '100%' }}
            src={`${API}/posts/photo/${posts.slug}`}
            alt={posts.title}
          />
        </Link>
      </section>

      <div className="card-body">
        <section>
          <Link className="link-dark" href={`/posts/${posts.slug}`}>
            <h5 className="card-title">{posts.title}</h5>
          </Link>
          <p className="card-text">{renderHTML(posts.excerpt)}</p>
        </section>
      </div>

      <div className="card-body">
        Posted {moment(posts.updatedAt).fromNow()} by{' '}
        <Link href={`/profile/${posts.postedBy.username}`}>
          <span className="badge text-bg-primary">
            {posts.postedBy.username}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SmallCard;

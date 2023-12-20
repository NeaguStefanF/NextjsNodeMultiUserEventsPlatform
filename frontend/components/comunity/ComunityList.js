import renderHTML from 'react-render-html';
import moment from 'moment';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';
import styles from '../comunity/Comunity.module.css';
import DisqusThread from '../DisqusThread';

const ComunityList = ({ comunity }) => {
  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={comunity._id}
          title={comunity.title}
          path={`/comunity/${comunity.slug}`}
        />
      </div>
    );
  };

  return (
    <div className={`${styles.ComunityPost} mb-5 mt-4`}>
      <section>
        <div className="container">
          <h1 className="display-4 pb-3 pt-3 text-center font-weight-bold">
            {comunity.title}
          </h1>
          <p className="lead mt-3 mark">
            Posted by{' '}
            <Link
              href={`/profile/${comunity.postedBy.username}`}
            >
              <span className="badge text-bg-primary">
                {comunity.postedBy.username}
              </span>
            </Link>{' '}
            | Published{' '}
            {moment(comunity.updatedAt).fromNow()}
          </p>
        </div>
      </section>
      <div className="container">
        <section>
          <div
            style={{
              fontSize: '16px',
              lineHeight: '1.5',
              wordBreak: 'break-word',

              maxHeight: '600px',
              overflowY: 'scroll',
            }}
          >
            {renderHTML(comunity.body)}
            <style jsx global>{`
              .col-md-8 img {
                max-width: 100%;
                max-height: 550px;
              }
            `}</style>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ComunityList;

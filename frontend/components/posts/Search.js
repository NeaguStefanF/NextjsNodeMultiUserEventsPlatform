import Link from 'next/link';
import renderHTML from 'react-render-html';
import { useEffect, useState } from 'react';
import { listSearch } from '../../actions/posts';
import 'bootstrap/dist/css/bootstrap.css';

const Search = () => {
  const [values, setValues] = useState({
    search: undefined,
    results: [],
    searched: false,
    message: '',
  });
  const { search, results, searched, message } = values;

  const searchSubmit = (e) => {
    e.preventDefault();
    listSearch({ search }).then((data) => {
      setValues({
        ...values,
        results: data,
        searched: true,
        message: `${data.length} posts found`,
      });
    });
  };

  const handleChange = (e) => {
    // console.log(e.target.value);
    setValues({
      ...values,
      search: e.target.value,
      searched: false,
      results: [],
    });
  };

  const searchedPosts = (results = []) => {
    return (
      <div className="jumbotron bg-white">
        {message && <p className="text-muted font-italic">{message}</p>}
        {results.map((posts, i) => {
          return (
            <div key={i}>
              <Link href={`/posts/${posts.slug}`}>
                <span className="btn btn-outline-primary btn-sm mb-1">
                  {posts.title}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <div className="row">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Search posts"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <button
            style={{ padding: '5px', width: '100%' }}
            className="btn btn-block btn-outline-primary w-100"
            type="submit"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div
      style={{ paddingRight: '60px', paddingLeft: '60px' }}
      className="container-fluid"
    >
      <div className="pt-3 pb-1">{searchForm()}</div>
      {searched && <div>{searchedPosts(results)}</div>}
    </div>
  );
};

export default Search;

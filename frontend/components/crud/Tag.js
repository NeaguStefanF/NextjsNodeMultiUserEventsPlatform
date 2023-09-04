import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';
import { getCookie } from '../../actions/auth';
import { create, getTags, removeTag } from '../../actions/tag';
import styles from '../crud/Category.module.css';

const Tag = () => {
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    tags: [],
    removed: '',
  });

  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie('token');

  useEffect(() => {
    loadTags();
  }, [reload]);

  const loadTags = () => {
    getTags().then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, tags: data });
      }
    });
  };

  const showTags = () => {
    if (tags && tags.length > 0) {
      return tags.map((t, i) => {
        return (
          <button
            onDoubleClick={() => deleteConfirm(t.slug)}
            title="Double click to delete"
            key={i}
            className={`btn btn-outline-primary ${styles['custom-button']} mt-3`}
          >
            {t.name}
          </button>
        );
      });
    } else {
      return null;
    }
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm('Are you sure you want to delete this tag?');
    if (answer) {
      deleteTag(slug);
    }
  };

  const deleteTag = (slug) => {
    // console.log('category deleted', slug);
    removeTag(slug, token).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: '',
          removed: !removed,
          reload: !reload,
        });
      }
    });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    create({ name }, token)
      .then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error, success: false });
        } else {
          setValues({
            ...values,
            error: false,
            success: true,
            name: '',
            removed: !removed,
            reload: !reload,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: '',
    });
  };

  const showSuccess = () => {
    if (success) {
      return <p className="text-success">Tag created</p>;
    }
  };

  const showError = () => {
    if (error) {
      return <p className="text-danger">Tag already exist</p>;
    }
  };

  const showRemoved = () => {
    if (removed && !success && !error) {
      return <p className="text-danger">Tag removed</p>;
    }
  };

  const mouseMoveHandler = (e) => {
    setValues({ ...values, error: false, success: false, removed: '' });
  };

  const newTagForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Add Tag</label>
        <input
          type="text"
          className="form-control mb-3 mt-1"
          onChange={handleChange}
          value={name}
          required
        />
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );

  return (
    <>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {newTagForm()}
        {showTags()}
      </div>
    </>
  );
};

export default Tag;

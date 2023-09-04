import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import { getCookie, isAuth, updateUser } from '../../actions/auth';
import { getProfile, update } from '../../actions/user';
import { API } from '../../config';

const ProfileUpdate = () => {
  const [values, setValues] = useState({
    username: '',
    username_for_photo: '',
    name: '',
    email: '',
    about: '',
    password: '',
    error: false,
    success: false,
    loading: false,
    photo: '',
    userData: new FormData(),
  });

  const token = getCookie('token');

  const {
    username,
    username_for_photo,
    name,
    email,
    about,
    password,
    error,
    success,
    loading,
    photo,
    userData,
  } = values;

  const init = () => {
    getProfile(token).then((data) => {
      console.log('data:', data);
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else if (data && data.username) {
        // Check if data and username are defined
        setValues({
          ...values,
          username: data.username,
          username_for_photo: data.username,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  useEffect(() => {
    init();
    setValues({ ...values, userData: new FormData() });
  }, []);

  const handleChange = (name) => (e) => {
    // console.log(e.target.value);
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    // let userFormData = new FormData();
    userData.set(name, value);
    // console.log(...userData); // SEE THE FORMDATA IN CONSOLE
    setValues({
      ...values,
      [name]: value,
      userData,
      error: false,
      success: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setValues({ ...values, loading: true });
    update(token, userData).then((data) => {
      if (data && data.error) {
        console.log('data.error', data.error);
        setValues({ ...values, error: data.error, loading: false });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            username: data.username,
            name: data.name,
            email: data.email,
            about: data.about,
            password: '',
            success: true,
            loading: false,
          });
        });
      }
    });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="btn btn-outline-secondary mb-3">
          Change Profile Photo
          <input
            onChange={handleChange('photo')}
            type="file"
            accept="image/*"
            hidden
          />
        </label>
      </div>
      <div className="form-group mt-3 mb-1">
        <label className="text-muted ">Username</label>
        <input
          onChange={handleChange('username')}
          type="text"
          value={username}
          className="form-control"
        />
      </div>
      <div className="form-group mt-3 mb-1">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange('name')}
          type="text"
          value={name}
          className="form-control"
        />
      </div>
      {/*<div className="form-group">
        <label className="text-muted">Email</label>
        <input onChange={handleChange('email')} type="text" value={email} className="form-control" />
    </div>*/}
      <div className="form-group mt-3 mb-1">
        <label className="text-muted">About</label>
        <textarea
          onChange={handleChange('about')}
          type="text"
          value={about}
          className="form-control"
        />
      </div>
      <div className="form-group mt-3 mb-1">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange('password')}
          type="password"
          value={password}
          className="form-control"
        />
      </div>
      <div>
        {showSuccess()}
        {showError()}
        {showLoading()}
      </div>
      <div>
        <button
          type="submit"
          className="btn btn-primary mt-3 mb-1"
          disabled={!username || !name || !email}
        >
          Save changes
        </button>
      </div>
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? '' : 'none' }}
    >
      Profile Updated
    </div>
  );

  const showLoading = () => (
    <div
      className="alert alert-info"
      style={{ display: loading ? '' : 'none' }}
    >
      Loading...
    </div>
  );

  return (
    <>
      <div className="container">
        <div className="row">
          <div style={{ padding: '60px' }} className="col-md-6 mb-5">
            {profileUpdateForm()}
          </div>
          <div style={{ padding: '60px' }} className="col-md-6 ">
            <img
              src={`${API}/user/photo/${username_for_photo}`}
              className="img img-fluid rounded-pill rounded mb-3"
              style={{ maxHeight: '400px', maxWidth: '400px' }}
              alt="user profile photo"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;

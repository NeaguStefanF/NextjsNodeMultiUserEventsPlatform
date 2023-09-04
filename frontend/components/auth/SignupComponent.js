//userstate from hook
import { useState, useEffect } from 'react';
import { signup, isAuth, preSignup } from '../../actions/auth';
import Router from 'next/router';
import React from 'react';

const SignupComponent = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    loading: false,
    message: '',
    showForm: true,
  });

  const { name, email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push(`/`);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { name, email, password };

    preSignup(user)
      .then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          setValues({
            ...values,
            name: '',
            email: '',
            password: '',
            error: '',
            loading: false,
            message: data && data.message ? data.message : '',
            showForm: false,
          });
        }
      })
      .catch((error) => {
        console.log('Signup error:', error);
      });
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : '';
  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : '';
  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : '';

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            onChange={handleChange('name')}
            type="text"
            className="form-control mb-3"
            placeholder="Type your name"
          />
        </div>

        <div className="form-group">
          <input
            value={email}
            onChange={handleChange('email')}
            type="email"
            className="form-control mb-3"
            placeholder="Type your email"
          />
        </div>

        <div className="form-group">
          <input
            value={password}
            onChange={handleChange('password')}
            type="password"
            className="form-control mb-3"
            placeholder="Type your password"
          />
        </div>

        <div>
          <button className="btn btn-primary">Signup</button>
        </div>
      </form>
    );
  };

  return (
    <>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signupForm()}
    </>
  );
};

export default SignupComponent;

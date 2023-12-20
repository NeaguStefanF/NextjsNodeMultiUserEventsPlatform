import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { API } from '../config';
import Router from 'next/router';

export const handleResponse = (response) => {
  if (response.status === 401) {
    signout(() => {
      Router.push({
        pathname: '/signin',
        query: {
          message: 'Your session expired, Signin Again.',
        },
      });
    });
  } else {
    return;
  }
};

//requests to backend to perform actions signup etc

export const preSignup = async (user) => {
  try {
    const response = await fetch(`${API}/pre-signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const signup = async (user) => {
  try {
    const response = await fetch(`${API}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const signin = async (user) => {
  try {
    const response = await fetch(`${API}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

export const signout = async (next) => {
  removeCookie('token');
  removeLocalStorage('user');
  next();

  try {
    await fetch(`${API}/signout`, {
      method: 'GET',
    });
    console.log('signout success');
  } catch (err) {
    console.log(err);
  }
};

export const setCookie = (key, value) => {
  if (typeof window !== 'undefined') {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

export const removeCookie = (key) => {
  if (typeof window !== 'undefined') {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

export const getCookie = (key) => {
  if (typeof window !== 'undefined') {
    return cookie.get(key);
  }
  return null;
};

export const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const authenticate = (data, next) => {
  if (data && data.token) {
    setCookie('token', data.token);
    setLocalStorage('user', data.user);
    next();
  } else {
    // Handle the case where data or data.token is undefined
    console.error('Invalid data or token');
  }
};

export const isAuth = () => {
  if (typeof window !== 'undefined') {
    const cookieChecked = getCookie('token');
    if (cookieChecked) {
      if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user'));
      } else {
        return false;
      }
    }
  }
  return false;
};

export const updateUser = (auth, next) => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('user')) {
      let authVar = JSON.parse(localStorage.getItem('auth'));
      authVar = auth;
      localStorage.setItem('auth', JSON.stringify(authVar));
      next();
    }
  }
};

//forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API}/forgot-password`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

//resetpassword
export const resetPassword = async (resetInfo) => {
  try {
    const response = await fetch(`${API}/reset-password`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetInfo),
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { handleResponse } from './auth';

export const create = async (category, token) => {
  try {
    const response = await fetch(`${API}/category`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });

    // handleResponse(response);
    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${API}/categories`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const singleCategory = async (slug) => {
  try {
    const response = await fetch(`${API}/category/${slug}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const removeCategory = async (slug, token) => {
  try {
    const response = await fetch(`${API}/category/${slug}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // handleResponse(response);
    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

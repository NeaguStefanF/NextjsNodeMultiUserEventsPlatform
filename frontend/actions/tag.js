import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { handleResponse } from './auth';

export const create = async (tag, token) => {
  try {
    const response = await fetch(`${API}/tag`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(tag),
    });

    // handleResponse(response);
    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getTags = async () => {
  try {
    const response = await fetch(`${API}/tags`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const singleTag = async (slug) => {
  try {
    const response = await fetch(`${API}/tag/${slug}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tag');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const removeTag = async (slug, token) => {
  try {
    const response = await fetch(`${API}/tag/${slug}`, {
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

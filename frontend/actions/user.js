import fetch from 'isomorphic-fetch';
import { API } from '../config';

//user profile
export const userPublicProfile = async (username) => {
  try {
    const response = await fetch(`${API}/user/${username}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create Public Profile');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API}/user/profile`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to Get Profile');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

//update
export const update = async (token, auth) => {
  try {
    const response = await fetch(`${API}/user/update`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: auth,
    });

    // handleResponse(response);
    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

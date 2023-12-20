import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { useEffect } from 'react';

export const emailContactForm = async (data) => {
  let emailEndpoint;

  if (data.authorEmail) {
    emailEndpoint = `${API}/contact-posts-author`;
  } else {
    emailEndpoint = `${API}/contact`;
  }
  try {
    const response = await fetch(`${emailEndpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

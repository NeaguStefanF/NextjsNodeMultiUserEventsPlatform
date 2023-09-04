import fetch from 'isomorphic-fetch';
import { API } from '../config';
import queryString from 'query-string';
import { isAuth, handleResponse } from './auth';

export const createPost = async (posts, token) => {
  let createPostsEndpoint;

  if (isAuth() && isAuth().role === 1) {
    createPostsEndpoint = `${API}/posts`;
  } else if (isAuth() && isAuth().role === 0) {
    createPostsEndpoint = `${API}/user/posts`;
  }
  try {
    const response = await fetch(`${createPostsEndpoint}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: posts,
    });

    // handleResponse(response);
    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const listAllPostsCategoriesTags = async (skip, limit) => {
  const data = {
    limit,
    skip,
  };
  try {
    const response = await fetch(`${API}/allposts-categories-tags`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        'Failed to get all list of posts plus categories and tags'
      );
    }

    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
    throw err; // Rethrow the error to handle it in the calling code
  }
};

export const singlePost = async (slug) => {
  try {
    const response = await fetch(`${API}/posts/${slug}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch single post');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

//related posts
export const listRelated = async (posts) => {
  try {
    const response = await fetch(`${API}/posts/related`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(posts),
    });

    if (!response.ok) {
      throw new Error('Failed to get related posts');
    }

    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//lists posts
export const list = async (username) => {
  let listallpostsEndpoint;

  if (username) {
    listallpostsEndpoint = `${API}/${username}/allposts`;
  } else {
    listallpostsEndpoint = `${API}/allposts`;
  }

  try {
    const response = await fetch(`${listallpostsEndpoint}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all posts');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

//remove posts
export const removePosts = async (slug, token) => {
  let deletePostsEndPoint;

  if (isAuth() && isAuth().role === 1) {
    deletePostsEndPoint = `${API}/posts/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    deletePostsEndPoint = `${API}/user/posts/${slug}`;
  }
  try {
    const response = await fetch(`${deletePostsEndPoint}`, {
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

//update posts
export const updatePosts = async (posts, token, slug) => {
  let updatePostsEndPoint;

  if (isAuth() && isAuth().role === 1) {
    updatePostsEndPoint = `${API}/posts/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updatePostsEndPoint = `${API}/user/posts/${slug}`;
  }
  try {
    const response = await fetch(`${updatePostsEndPoint}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: posts,
    });

    // handleResponse(response);
    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

//list search
export const listSearch = async (params) => {
  try {
    console.log('search params', params); // {search= node}
    const query = queryString.stringify(params); // ?limit=100&pagination=10
    console.log('query params', query);
    const response = await fetch(`${API}/allposts/search?${query}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to search all posts');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

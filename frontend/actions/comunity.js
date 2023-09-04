import fetch from 'isomorphic-fetch';
import { API } from '../config';
import { isAuth, handleResponse } from './auth';

export const createPostComunity = async (comunity, token) => {
  try {
    const response = await fetch(`${API}/comunity`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: comunity,
    });

    // handleResponse(response);
    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const list = async (skip, limit) => {
  const data = {
    limit,
    skip,
  };
  try {
    const response = await fetch(`${API}/listcomunity`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to get all list');
    }

    const json = await response.json();
    return json;
  } catch (err) {
    console.log(err);
    throw err; // Rethrow the error to handle it in the calling code
  }
};

export const listcomunityposts = async (username) => {
  let listallpostsEndpoint;

  if (username) {
    listallpostsEndpoint = `${API}/${username}/comunity`;
  } else {
    listallpostsEndpoint = `${API}/comunity`;
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

export const removePosts = async (slug, token) => {
  let deletePostsEndPoint;

  if (isAuth() && isAuth().role === 1) {
    deletePostsEndPoint = `${API}/comunity/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    deletePostsEndPoint = `${API}/user/comunity/${slug}`;
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

export const updatePosts = async (comunity, token, slug) => {
  let updatePostsEndPoint;

  if (isAuth() && isAuth().role === 1) {
    updatePostsEndPoint = `${API}/comunity/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updatePostsEndPoint = `${API}/user/comunity/${slug}`;
  }
  try {
    const response = await fetch(`${updatePostsEndPoint}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: comunity,
    });

    // handleResponse(response);
    return response.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const singlePost = async (slug) => {
  try {
    const response = await fetch(`${API}/comunities/${slug}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch single comunity');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// export const like = async (postId) => {
//   const userId = isAuth();

//   try {
//     const response = await fetch(`${API}/listcomunity/like`, {
//       method: 'PUT',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${userId}`,
//       },
//       body: JSON.stringify({ postId }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to like post');
//     }

//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };

// export const unlike = async (postId) => {
//   const userId = isAuth();

//   try {
//     const response = await fetch(`${API}/listcomunity/unlike`, {
//       method: 'PUT',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${userId}`,
//       },
//       body: JSON.stringify({ postId }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to unlike post');
//     }

//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };

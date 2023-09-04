const express = require('express');
const router = express.Router();
const {
  create,
  list,
  listAllPostsCategoriesTags,
  read,
  remove,
  update,
  photo,
  listRelated,
  listSearch,
  listByUser,
} = require('../controllers/posts');

//middlaware
const {
  requireSignin,
  adminMiddleware,
  authMiddleware,
  canUpdateDeletePosts,
} = require('../controllers/auth');

router.post('/posts', requireSignin, adminMiddleware, create);
router.get('/allposts', list);
router.post('/allposts-categories-tags', listAllPostsCategoriesTags);
router.get('/posts/:slug', read);
router.delete('/posts/:slug', requireSignin, adminMiddleware, remove);
router.put('/posts/:slug', requireSignin, adminMiddleware, update);
router.get('/posts/photo/:slug', photo);
router.post('/posts/related', listRelated);
router.get('/allposts/search', listSearch);

//auth user posts crud
router.post('/user/posts', requireSignin, authMiddleware, create);
router.get('/:username/allposts', listByUser);
router.delete(
  '/user/posts/:slug',
  requireSignin,
  authMiddleware,
  canUpdateDeletePosts,
  remove
);
router.put(
  '/user/posts/:slug',
  requireSignin,
  authMiddleware,
  canUpdateDeletePosts,
  update
);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  create,
  list,
  mlist,
  read,
  remove,
  update,
  listByUser,
  like,
  unlike,
} = require('../controllers/comunity');

//middlaware
const {
  requireSignin,
  adminMiddleware,
  authMiddleware,
  canUpdateDeleteComunitiesPosts,
} = require('../controllers/auth');

// first page
router.post('/comunity', requireSignin, authMiddleware, create);
router.post('/listcomunity', list);

//like and unlike
// router.put('/listcomunity/like', requireSignin, authMiddleware, like);
// router.put('/listcomunity/unlike', requireSignin, authMiddleware, unlike);

//manage comunity
router.get('/comunity', mlist);
router.get('/comunities/:slug', read);
router.delete('/comunity/:slug', requireSignin, adminMiddleware, remove);
router.put('/comunity/:slug', requireSignin, adminMiddleware, update);

//by normal user
router.get('/:username/comunity', listByUser);
router.delete(
  '/user/comunity/:slug',
  requireSignin,
  authMiddleware,
  canUpdateDeleteComunitiesPosts,
  remove
);
router.put(
  '/user/comunity/:slug',
  requireSignin,
  authMiddleware,
  canUpdateDeleteComunitiesPosts,
  update
);

module.exports = router;

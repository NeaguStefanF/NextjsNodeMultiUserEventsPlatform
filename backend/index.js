const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
// bring routes
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const formRoutes = require('./routes/form');
const comunityRoutes = require('./routes/comunity');

// app
const app = express();
app.use(express.json({ limit: '50mb', extended: true }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true })
);

// db mongodb
mongoose
  .connect(process.env.DATA_BASE, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connected');
  });

// middlewares
app.use(morgan('dev'));
app.use(cookieParser());

// cors
if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
} else {
  app.use(cors({ origin: true })); // Allow all origins during development
}

// routes middleware
app.use('/api', postsRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);
app.use('/api', formRoutes);
app.use('/api', comunityRoutes);

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

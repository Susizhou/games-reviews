const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/games.controllers.js');
const reviewRouter = require('./reviews-router.js');
const commentRouter = require('./comments-router.js');
const categoriesRouter = require('./categories-router.js')
const userRouter = require('./users-router.js')


apiRouter.get('/', getEndpoints);

apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/comments', commentRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/users', userRouter)


module.exports = apiRouter;
const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', authController.home_get);
router.get('/home', authController.home_get);
router.get('/forum', authController.forum_get);
router.get('/signin', authController.signin_get);
router.post('/signin', authController.signin_post);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/signout', authController.signout_get);
router.get('/contact', authController.contact_get);
router.get('/forumtopics', authController.forumTopics_get);
router.get('/forumprofile',  requireAuth, authController.forumProfile_get);

router.get('/forgetpassword', authController.forgetPassword_get);
router.post('/forgetpassword', authController.forgetPassword_post);

router.get('/createPost', authController.createPost_get);
router.post('/createPost', requireAuth, authController.createPost_post);

router.get('/:id', authController.forumPost_get);
router.post('/:id', requireAuth, authController.forumPost_post);
router.get('/verify/:uniqueString', authController.verifyGet);
router.get('/changepass/:uniqueString/:cpass', authController.changePassGet);



module.exports = router;


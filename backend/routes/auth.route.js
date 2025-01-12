import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { login, logout, register, search, verifyOtp } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/verify-otp').post(verifyOtp);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/search').post(isAuthenticated, search);

export default router;
import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { deleteOldGroupMessages, findParticipants, getGroupMessage, getPersonalMessage, sendGroupMessage, sendPersonalMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.route('/find/participants').get(isAuthenticated, findParticipants);
router.route('/send/:id').post(isAuthenticated, sendPersonalMessage);
router.route('/get').post(isAuthenticated, getPersonalMessage);
router.route('/all/send').post(isAuthenticated, sendGroupMessage);              //can't use /send/all    -->it will hit sendPersonalMessage
router.route('/all/get').get(isAuthenticated, getGroupMessage);

export default router;
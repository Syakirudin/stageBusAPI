import express from 'express';
import errorMsgController from '../controllers/error.controller.js';

const errorRouter = express.Router();

errorRouter.get('*', errorMsgController.notFound.bind(errorMsgController));

export { errorRouter }
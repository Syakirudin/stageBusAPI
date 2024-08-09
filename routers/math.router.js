import express from 'express';
import mathController from '../controllers/math.controller.js';

const mathRouter = express.Router();

mathRouter.get('/math/sum', mathController.getSum.bind(mathController));
mathRouter.get('/math/sub', mathController.getSub.bind(mathController));

export { mathRouter };

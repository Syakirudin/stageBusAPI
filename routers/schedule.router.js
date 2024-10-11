import express from 'express';
import ScheduleController from '../controllers/schedule.controller.js';

const ScheduleRouter = express.Router();

ScheduleRouter.get('/', ScheduleController.getAllSchedules);

ScheduleRouter.post('/', ScheduleController.createSchedule);

ScheduleRouter.put('/:id', ScheduleController.updateSchedule);

ScheduleRouter.delete('/:id', ScheduleController.deleteSchedule);

export default ScheduleRouter;

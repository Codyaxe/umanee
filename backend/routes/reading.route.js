import express from 'express';

import {
  getData

} from '../controllers/reading.controller.js';

const router = express.Router();

router.post("/data", getData);

export default router;
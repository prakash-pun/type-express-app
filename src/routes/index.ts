import { Router } from "express";
import auth from './auth';
import dashboard from './todo';

const router = Router();

router.use("/auth", auth);
router.use("/todo", dashboard);

export default router;
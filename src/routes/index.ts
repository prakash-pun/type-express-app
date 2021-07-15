import { Router } from "express";
import auth from './auth';
import dashboard from './todo';
import note from './note';

const router = Router();

router.use("/auth", auth);
router.use("/todo", dashboard);
router.use("/note", note);

export default router;
import { Router } from "express";
import auth from "./auth";
import todo from "./todo";
import note from "./note";

const router = Router();

router.use("/auth", auth);
router.use("/todo", todo);
router.use("/note", note);

export default router;

import { Router, Request, Response } from "express";

const router = Router();

/**
 * @route GET /dashboard
 * @desc Dashboard 
 * @access Public
 */
router.get("/", (req: Request, res: Response) => {
  res.send(200);
})

export default router;
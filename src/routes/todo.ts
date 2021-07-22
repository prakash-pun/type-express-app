import 'reflect-metadata';
import { Router, Request, Response } from "express";
import { validate } from 'class-validator'
import Todo from 'models/Todo';
import jwtAuth from 'middleware/jwtAuth';
const router = Router();

/**
 * @route GET /todo
 * @desc todos 
 * @access Public
 */

router.get("/",  async (req: Request, res: Response) => {
  const todos = await Todo.find();
  res.json(todos);
})


router.post("/", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const { text } = req.body;
  console.log(text);
  if (text) {
    const todo = await Todo.create(req.body);
    const result = await todo.save();
    return res.status(201).send(result);
  } else {
    return res.status(400).json({ "message": "error occured" });
  }
})


router.get('/:id', jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  const todoInfo = await Todo.findById(id);
  return res.status(200).send(todoInfo);
})


router.put('/:id', jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  const todoInfo = await Todo.findById(id);
  todoInfo.updateOne(todoInfo, req.body);
  const result = await todoInfo.save();
  return res.status(200).send(result);
})


router.post('/:id/complete', jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const todoInfo = await Todo.findById(id);
  todoInfo.isCompleted = true;
  const result = await todoInfo.save();
  return res.status(200).send(result);
})


router.delete('/:id', jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const todoInfo = await Todo.findById(id)
  todoInfo.delete();
  return res.status(200).send({"detail":"delete"})
})

export default router;
import 'reflect-metadata';
import { Router, Request, Response } from "express";
import {getManager, getRepository} from "typeorm";
import { validate } from 'class-validator'
import { Todo } from 'entity/Todo';

const router = Router();

/**
 * @route GET /todo
 * @desc todos 
 * @access Public
 */

router.get("/", async (req: Request, res: Response) => {
  const todos = await Todo.find();
  console.log(todos);
  res.json(todos);
})

router.post("/", async (req: Request, res: Response) => {
  const { text } = req.body;
  console.log(text);
  if (text) {
    const todo = await Todo.create(req.body);
    const result = await Todo.save(todo);
    return res.status(201).send(result);
  } else {
    return res.status(400).json({ "message": "error occured" });
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  const todoInfo = await Todo.findOne({ id: id });
  return res.status(200).send(todoInfo);
})

router.put('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  const todoInfo = await Todo.findOne({ id: id });
  Todo.merge(todoInfo, req.body);
  console.log(req.body);
  const result = await Todo.save(todoInfo);
  return res.status(200).send(result);
})

router.post('/:id/complete', async (req: Request, res: Response) => {
  const id = req.params.id;
  const todoInfo = await Todo.findOne({ id: id });
  todoInfo.isCompleted = true;
  const result = await Todo.save(todoInfo);
  return res.status(200).send(result);
})

router.delete('/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const todoInfo = await Todo.findOne({ id: id })
  Todo.delete(todoInfo);
  return res.status(200).send({"detail":"delete"})
})

export default router;
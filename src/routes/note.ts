import { Router, Request, Response } from "express";
import { validationResult, Result, ValidationError } from "express-validator";
import jwtAuth from 'middleware/jwtAuth';
import { Notes } from "entity/Notes";
import validateNote from "util/validation/validateNote";
import { getRepository } from "typeorm";

const router = Router();

/**
 * @route GET POST PUT DELETE /note
 * @desc my notes 
 * @access Authenticated
 */

router.get("/", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const noteRepository = getRepository(Notes);
  const user = req.user.id;
  const note = await noteRepository.find({
    where: {owner: user}});
  console.log(note);
  res.status(200).json(note);
})

router.post("/", validateNote, jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const noteData:{
    title: string,
    subTitle: string,
    noteImage: string,
    tags: string,
    content:string,
  } = {
    title: req.body.title,
    subTitle: req.body.subTitle,
    noteImage: req.body.noteImage,
    tags: req.body.tags,
    content: req.body.content,
  }
  const errors: Result<ValidationError> = validationResult( req );
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }else{
    try{    
      const noteRepository = getRepository(Notes);
      let notes: Notes;
      notes = await noteRepository.create(noteData);
      notes.owner = req.user;
      const result = await noteRepository.save(notes);
      return res.status(201).json(result);
    }catch(err){
      return res.status(201).json({status: errors, message: "error creating note"});
    }
  }
})

router.get('/:id', jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const noteRepository = getRepository(Notes);
  const user = req.user.id;
  let note: Notes;
  note = await noteRepository.findOne({
    where: {
      owner: user,
      id: req.params.id,
    }});
  console.log(note);
  if(!note){
    res.status(404).json({
      status: "error",
      message: "Note not found",
    });
  }else{
    res.status(200).json(note);
  }
})

router.put("/:id", validateNote, jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const noteData:{
    title: string,
    subTitle: string,
    noteImage: string,
    tags: string,
    content:string,
  } = {
    title: req.body.title,
    subTitle: req.body.subTitle,
    noteImage: req.body.noteImage,
    tags: req.body.tags,
    content: req.body.content,
  }
  const errors: Result<ValidationError> = validationResult( req );
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const noteRepository = getRepository(Notes);
  let note: Notes;
  try{
    note = await noteRepository.findOne({
      where:{
        owner: req.user.id,
        id: req.params.id,
      }
    });
    console.log(note);
    if(!note){
      res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }else{
      noteRepository.merge(note, noteData);
      const result = await noteRepository.save(note);
      return res.status(200).json(result);
    }
  }catch{
    return res.status(400).json({status: "error", message: "error updating note"});
  }
});

router.delete("/:id", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const noteRepository = getRepository(Notes);
  const user = req.user.id;
  let note: Notes;
  note = await noteRepository.findOne({
    where: {
      owner: user,
      id: req.params.id,
    }});
  console.log(note);
  if(!note){
    res.status(404).json({
      status: "error",
      message: "Note not found",
    });
  }else{
    noteRepository.delete(req.params.id);
    res.status(200).json({status: "success", message: "note deleted"});
  }
});

export default router;
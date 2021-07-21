import { Router, Request, Response } from "express";
import { validationResult, Result, ValidationError } from "express-validator";
import multer from "multer";
import jwtAuth from 'middleware/jwtAuth';
import { Notes } from "entity/Notes";
import validateNote from "util/validation/validateNote";
import { getMongoRepository, getRepository } from "typeorm";
import { amqpConnect, amqpSend } from "config";
import  { v4 as uuidv4 } from 'uuid';
import mongoose, { mongo, ObjectId } from "mongoose";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void) {
    const dir = './notes';
    callback(null, dir);
  },
  filename: function (req: Request, file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void) {
    const uuid = uuidv4();
    callback(null, 'notes-'+ new Date().getTime() + file.originalname);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File,
  callback: (error: Error | null, destination: boolean) => void) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const router = Router();

/**
 * @route GET POST PUT DELETE /note
 * @desc my notes 
 * @access Authenticated
 */


let channel;
amqpConnect({ url: process.env.CLOUDAMQP_URL })
.then(ch => {
  channel = ch;
});


router.get("/", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const noteRepository = getMongoRepository(Notes);
  const user = req.user.id;
  const page: number = parseInt(req.query.page as any) || 1;
  const limit: number = parseInt(req.query.limit as any) || 5;
  const total = await noteRepository.count({ where: { owner: user } });
  let options = {}

  const note = await noteRepository.find({
    ...options,
    take:limit,
    skip: (page - 1) * limit,
    where: { owner: user }
  });

  res.status(200).json({total, page, last_page: Math.ceil(total/limit), note});
})


router.post("/", jwtAuth.verifyLogin, upload.single('noteImage'), async (req: Request, res: Response) => {

  const errors: Result<ValidationError> = validationResult( req );
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }else{
    try {
      const noteData:{
        title: string,
        subTitle: string,
        noteImage: string,
        tags: string,
        content: string,
        noteShare: boolean;
      } = {
        title: req.body.title,
        subTitle: req.body.subTitle,
        noteImage: req.file.path,
        tags: req.body.tags,
        content: req.body.content,
        noteShare: req.body.noteShare,
      }

      const noteRepository = getMongoRepository(Notes);
      let notes: Notes;
      notes = await noteRepository.create(noteData);
      notes.owner = req.user;
      const result = await noteRepository.save(notes);
      const filePath = req.file;
      const postData = {result, filePath};
      if (result.noteShare == true) amqpSend(channel, JSON.stringify(postData), 'note_created');
      return res.status(201).json(result);
    } catch (err) {
      console.log(err);
      return res.status(201).json({status: errors, message: "error creating note"});
    }
  }
})


router.get('/:id', jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const noteRepository = getMongoRepository(Notes);
  const user = req.user.id;
  let note: Notes;
  const id: mongoose.Types._ObjectId = new mongoose.Types.ObjectId(req.params.id);
  note = await noteRepository.findOne(id: id, owner: req.user});
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
  const noteRepository = getMongoRepository(Notes);
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
  const noteRepository = getMongoRepository(Notes);
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
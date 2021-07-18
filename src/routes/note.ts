import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwtAuth from 'middleware/jwtAuth';
import { Notes } from "entity/Notes";
import checkValidation from 'middleware/jwtAuth';

const router = Router();

/**
 * @route GET /note
 * @desc my notes 
 * @access Public
 */

router.get("/", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
  const notes = await Notes.find();
  res.status(200).json(notes);
})

router.post("/", jwtAuth.verifyLogin, async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const noteData = {
      title: req.body.title,
      subTitle: req.body.subTitle,
      noteImage: req.body.noteImage,
      tags: req.body.tags,
      content: req.body.content,
    }
    const id = req.user.id;
    console.log(id);
    const notes = await Notes.create(noteData);
    notes.owner = req.user;
    const result = await Notes.save(notes);
    return res.status(201).json(result);
  // }catch(err){
  //   return res.status(500).json({"message": "error creating note"});
  // }
})

export default router;
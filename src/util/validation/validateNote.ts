import { check } from "express-validator";

export default [
    check("title").isLength({ min: 3 }),
    check("subTitle").isLength({ min: 3 }),
    check("content").isLength({ min: 8 })
];

import { Router } from "express";
import { createUser, getUser } from "../controllers/UserController";

const UserRouter = Router();

UserRouter.get('/:username', getUser);
UserRouter.post('/', createUser);

export default UserRouter;
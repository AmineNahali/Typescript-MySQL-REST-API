import { Router } from "express";
import { registerUser, getUser, loginUser } from "../controllers/UserController";

const UserRouter = Router();

UserRouter.get('/:username', getUser);
UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);

export default UserRouter;
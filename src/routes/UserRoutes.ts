import { Router } from "express";
import { registerUser, getUser, loginUser, refresh } from "../controllers/UserController";

const UserRouter = Router();

UserRouter.get('/:username', getUser);
UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);
UserRouter.post('/token', refresh);

export default UserRouter;
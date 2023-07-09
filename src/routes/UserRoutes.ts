import { Router } from "express";
import { registerUser, loginUser, refresh } from "../controllers/UserController";

const UserRouter = Router();

UserRouter.post('/register', registerUser);
UserRouter.post('/login', loginUser);
UserRouter.post('/token', refresh);

UserRouter.use(require('./auth'))
.get('/',(req, res)=>{
    res.send('I am secure :*');
});

export default UserRouter;
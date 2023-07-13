import { Router } from "express";
import { registerUser, loginUser, refresh } from "../controllers/UserController";
import { auth } from "./auth";

const UserRouter = Router();

UserRouter
.post('/register', registerUser)
.post('/login', loginUser)
.post('/aquireToken', refresh)

.get('/',auth,(req, res)=>{
    res.send('I am secure :*');
});

export default UserRouter;
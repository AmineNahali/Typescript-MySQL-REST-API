import { db } from "../../db";
import { validateUser } from "../models/UserModel";
import bcrypt from "bcrypt";


export function getUser(req: any, res: any) {
    const queryString = "SELECT USERNAME, EMAIL FROM DATABASE1.USERS WHERE USERNAME=?";
    db
        .promise()
        .query(
            queryString,
            req.params.username
        )
        .then(([rows, fields]) => {
            res.json({ "success": true, "message": rows });
        })
        .catch((e) => {
            console.log(e);
            res.json({ "success": false, "message": "internal server error : " });
            db.end();
        })
}

export function createUser(req: any, res: any) {
    if (validateUser(req.body)) {
        const queryString = "INSERT INTO DATABASE1.USERS (USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?)";
        db
            .promise()
            .query(
                queryString,
                [
                    req.body.username,
                    req.body.email,
                    bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()) // const verified = bcrypt.compareSync('Pa$$w0rd', passwordHash);
                ]
            )
            .then(([rows, fields]) => {
                res.json({ "success": true, "message": "registered successfully" });
            })
            .catch((e) => {
                console.log(e);
                res.json({ "success": false, "message": "internal server error" });
                db.end();
            })
    }
    else {
        res.json({ "success": false, "message": "user is not valid" });
    }
}
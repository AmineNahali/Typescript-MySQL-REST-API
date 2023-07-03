import { db } from "../../db";
import { validate_UserLoginForm, validate_UserRegisterForm } from "../models/UserModel";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export function getUser(req: Request, res: Response) {
    const queryString = "SELECT USERNAME, EMAIL FROM DATABASE1.USERS WHERE USERNAME=?";
    db
        .promise()
        .query(
            queryString,
            req.params.username
        )
        .then(([rows, fields]) => {
            res.json({ "success": true, "message": rows, "serverTime": timeStmp(), "nb": (rows as Array<any>).length });
        })
        .catch((e) => {
            console.log(e);
            res.json({ "success": false, "message": "internal server error please try again later.", "serverTime": timeStmp() });
            db.end();
        });
}

export function registerUser(req: Request, res: Response) {
    if (validate_UserRegisterForm(req.body)) {
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
                res.json({ "success": true, "message": "registered successfully", "serverTime": timeStmp() });
            })
            .catch((e) => {
                console.log(e);
                res.json({ "success": false, "message": "internal server error please try again later.", "serverTime": timeStmp() });
                db.end();
            });
    }
    else {
        res.json({ "success": false, "message": "user is not valid", "serverTime": timeStmp() });
    }
}

export function loginUser(req: Request, res: Response) {
    if (validate_UserLoginForm(req.body)) {
        const queryString = "SELECT USERNAME, EMAIL, PASSWORD FROM DATABASE1.USERS WHERE USERNAME=?";
        db
            .promise()
            .query(
                queryString,
                req.body.username
            )
            .then(([rows, fields]) => {
                var count = (rows as Array<any>).length;
                if (count == 1) {
                    //Verify the password
                    if (bcrypt.compareSync(req.body.password, (rows as Array<any>)[0].PASSWORD)) {
                        res.json({ "success": true, "message": "password is correct !", "serverTime": timeStmp() });
                        ///////// more work
                    }
                    else{
                        res.json({ "success": false, "message": "password is wrong.", "serverTime": timeStmp() });
                    }
                }
                else {
                    res.json({ "success": false, "message": "User does not exist.", "serverTime": timeStmp() });
                }
            })
            .catch((e) => {
                console.log(e);
                res.json({ "success": false, "message": "internal server error please try again later.", "serverTime": timeStmp() });
                db.end();
            });
    }else {
        res.json({ "success": false, "message": "Invalid credentials.", "serverTime": timeStmp() });
    }

}







export function timeStmp() {
    const currentDate = new Date();
    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); //January is 0, not 1
    const currentYear = currentDate.getFullYear();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const stamp = currentHour + ":" + currentMinutes + " " + currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear; // "27-11-2020"
    return stamp;
}

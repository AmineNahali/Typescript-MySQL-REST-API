import { db } from "../../db";
import { validate_UserLoginForm, validate_UserRegisterForm, isEmail } from "../models/UserModel";
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
            res.json({ "success": true, "message": rows, "serverTime": fastTimeStamp(), "nb": (rows as Array<any>).length });
        })
        .catch((e) => {
            console.log(e);
            res.json({ "success": false, "message": "internal server error please try again later.", "serverTime": fastTimeStamp() });
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
                res.json({ "success": true, "message": "registered successfully", "serverTime": fastTimeStamp() });
            })
            .catch((e) => {
                console.log(e);
                res.json({ "success": false, "message": "internal server error please try again later.", "serverTime": fastTimeStamp() });
                db.end();
            });
    }
    else {
        res.json({ "success": false, "message": "user is not valid", "serverTime": fastTimeStamp() });
    }
}

export function loginUser(req: Request, res: Response) {
    if (validate_UserLoginForm(req.body)) {
        var queryString = "";
        queryString = "SELECT USERNAME, EMAIL, PASSWORD FROM DATABASE1.USERS WHERE USERNAME=?";
        console.log("Username !!!!!!");
        if (isEmail(req.body.username)) {
            queryString = "SELECT USERNAME, EMAIL, PASSWORD FROM DATABASE1.USERS WHERE EMAIL=?";
            console.log("actually it's an Email !!!!!!");
        }
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
                        res.json({ "success": true, "message": "password is correct !", "serverTime": fastTimeStamp() });
                        ///////// more work
                        //create tokens
                    }
                    else {
                        res.json({ "success": false, "message": "password is wrong.", "serverTime": fastTimeStamp() });
                    }
                }
                else {
                    res.json({ "success": false, "message": "User does not exist.", "serverTime": fastTimeStamp() });
                }
            })
            .catch((e) => {
                console.log(e);
                res.json({ "success": false, "message": "internal server error please try again later.", "serverTime": fastTimeStamp() });
                db.end();
            });
    } else {
        res.json({ "success": false, "message": "Invalid credentials.", "serverTime": fastTimeStamp() });
    }

}

export function fastTimeStamp() {
    /*
        this is a fast time stamp function that represents date as a number which allows for simpler
        date comparison and sorting by date maybe needed for future features but for now it signals
        server time current to every json response.
        TODO: turn this into a class and create methods to get individual parts of stamp each seperately : year month etc..
    */
    const currentDate = new Date();

    return (
        currentDate.getFullYear() * 10000000000000 +  //2023 plus 13 zeros
        (currentDate.getMonth() + 1) * 100000000000 +    //2023|01 plus 11 zeros (remember that January is 0, not 1)
        currentDate.getDate() * 1000000000 +      //202301|31 plus 9 zeros
        currentDate.getHours() * 10000000 +        //20230131|12 plus 7 zeros
        currentDate.getMinutes() * 100000 +          //2023013112|59 plus 5 zeros
        currentDate.getSeconds() * 1000 +            //202301311259|59 plus 
        currentDate.getMilliseconds()                    //milliseconds get added directly to the sum
    )
}

function signJWT(){

}
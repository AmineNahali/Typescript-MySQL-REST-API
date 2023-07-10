import { db, redisClient } from "../../db";
import { validate_UserLoginForm, validate_UserRegisterForm, isEmail } from "../models/UserModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const jwt = require('jsonwebtoken');

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
                    bcrypt.hashSync(req.body.password, bcrypt.genSaltSync())
                ]
            )
            .then(([rows, fields]) => {
                res.json({ "success": true, "message": "registered successfully", "serverTime": fastTimeStamp() });
            })
            .catch((e) => {
                console.log(e);
                res.json({ "success": false, "message": "internal server error please try again later.", "serverTime": fastTimeStamp() });
                db.end();
            })
            ;
    }
    else {
        res.json({ "success": false, "message": "user is not valid", "serverTime": fastTimeStamp() });
    }
}

export function loginUser(req: Request, res: Response) {
    if (validate_UserLoginForm(req.body)) {
        var queryString = "SELECT USERNAME, EMAIL, PASSWORD FROM DATABASE1.USERS WHERE USERNAME=?";
        if (isEmail(req.body.username)) {
            queryString = "SELECT USERNAME, EMAIL, PASSWORD FROM DATABASE1.USERS WHERE EMAIL=?";
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
                        //create tokens
                        const user = {
                            "email": (rows as Array<any>)[0].EMAIL,
                            "name": (rows as Array<any>)[0].USERNAME
                        }
                        const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TTL });
                        const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TTL });
                        //tokenList[refreshToken] = accessToken;
                        redisClient.set(refreshToken, accessToken)
                            .then(() => {
                                res.json({ "success": true, "accessToken": accessToken, "refreshToken": refreshToken, "serverTime": fastTimeStamp() });
                            })
                            .catch(e => { console.log("redis panic !!!" + e); redisClient.disconnect() });
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

export function refresh(req: Request, res: Response) {
    const postData = req.body
    redisClient.get(postData.refreshToken)
        .then((value) => {
            // if refresh token exists
            if ((postData.refreshToken) && value) {
                const user = {
                    "email": postData.email,
                    "name": postData.name
                };
                //create new token
                const newtoken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TTL });

                // update the token in the list
                redisClient.set(postData.refreshToken, newtoken)
                    .then(() => {
                        res.status(200).json({
                            "accessToken": newtoken, "serverTime": fastTimeStamp()
                        });
                    })
                    .catch(e => { console.log("redis panic !!!" + e); redisClient.disconnect() });

            } else {
                res.status(404).send('Invalid request');
            }
        })
        .catch(e => { console.log("redis panic !!!" + e); redisClient.disconnect() });

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
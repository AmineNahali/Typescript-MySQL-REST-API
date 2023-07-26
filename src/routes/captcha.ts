var captcha = require("nodejs-captcha");
import { Router } from "express";
import { redisClient } from "../../db";
import { fastTimeStamp } from "../controllers/UserController"

const captchaRouter = Router();

captchaRouter
    .post("/image/:id", (req, res) => {
        // Create new Captcha
        var newCaptcha = captcha();

        var base64Data = newCaptcha.image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        var img = Buffer.from(base64Data, 'base64');

        redisClient.set("captchaid:" + req.params.id, newCaptcha.value)
            .then(() => {
                //once the id and value of the captcha image are saved, we can now send the image
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': img.length
                });
                res.end(img); //note: image size is 200 x 100
            })
            .catch(e => { console.log("redis panic !!! Cannot save captcha image"); redisClient.disconnect(); });
    })
    .post("/imageVerify", (req, res) => {
        redisClient.get("captchaid:" + req.body.id)
            .then((data) => {
                if (data) { //captcha answer is provided by the user
                    if (req.body.answer == data) { //captcha is guessed correctly !
                        var regKey = randomString();
                        redisClient.set("regKey:" + req.body.id, regKey)
                            .then(() => { // since the captcha is guessed correctly, we save a registration key for the user.
                                res.json({ "success": true, "registerKey": regKey, "serverTime": fastTimeStamp() });
                            })
                            .catch(e => { console.log("redis panic !!! Cannot save captcha image"); redisClient.disconnect(); });
                    }else{//captcha is guessed wrong !
                        res.json({ "success": false, "serverTime": fastTimeStamp() });
                    }
                }
                else { //captcha answer is not provided
                    res.json({ "success": false, "serverTime": fastTimeStamp() });
                }
            })
            .catch(e => { console.log("redis panic !!! Cannot get Captcha id"); redisClient.disconnect(); });
    })

export default captchaRouter;

export function randomString() { // provides a random string composed of 10 chars.
    let result = '';
    const characters = 'AIF6NOpqrstui7jklmBGXHnUo34v8wxyz012PQRS9TVWZabcdJKLMCYDEefgh5';
    let counter = 0;
    while (counter < 10) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
    }
    return result;
}
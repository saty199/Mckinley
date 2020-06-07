const express = require('express');
const router = express.Router();
const { Token } = require('./auth');
const User = require('./schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
var algorithm = 'aes256';
var key = 'password';
var cipher = crypto.createCipher(algorithm, key);

const createToken = (userInfo) => {
    var token = jwt.sign({ ID: userInfo._id, userInfo }, 'my-secret');
    return token;
};

const Login = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: "Please fill all required fields." })
    }
    const email = req.body.email;
    const password = req.body.password
    let user = await User.findOne({ email });
    if (user) {
        let match = await bcrypt.compare(password, user.password);
        if (match == true || match == 'true') {
            let token = await createToken(user);
            return res.status(200).send({ message: "Successfully Signed In", token });
        } else {
            return res.status(401).send({ message: "Enter the correct Password, Please try again!!!" })
        }
    } else {
        return res.status(404).send({ message: "User data not Found!" })
    }
}

const SignUp = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ message: "Please fill all required fields." })
    }
    const data = {
        firstName: req.body.firstName,
        email: req.body.email,
        password: req.body.password,
        lastName: req.body.lastName,
        contactNo: req.body.contactNo
    }
    let user = await User.create(data);
    if (user) {
        return res.status(200).send({ message: "User created successfully", user });
    } else {
        return res.status(400).send({ message: "Something went wrong" })
    }
}

const EncryptMessage = async (req, res) => {
    let text = req.body.message;
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return res.status(200).send({encrypted});
}

router.post('/login', Login);
router.post('/signup', SignUp);
router.post('/encryptmessage',Token,EncryptMessage)


module.exports = router;
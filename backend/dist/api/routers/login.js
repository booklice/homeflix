"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../database/mysql");
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body
//   // Check for user email
//   const user = await User.findOne({ email })
//   if (user && (await bcrypt.compare(password, user.password))) {
//     res.json({
//       _id: user.id,
//       name: user.name,
//       email: user.email,
//       token: generateToken(user._id),
//     })
//   } else {
//     res.status(400)
//     throw new Error('Invalid credentials')
//   }
// })
const generateToken = (user) => {
    return jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "6h" });
};
router.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const correct = username === process.env.USERNAME && password === process.env.PASSWORD;
    const user = {
        username: username,
        password: password,
    };
    if (correct) {
        res.json({
            username: username,
            password: password,
            token: generateToken(user),
        });
    }
    else {
        yield db.connection.query("SELECT * FROM user", (result) => {
            console.log("result", result);
        });
        res.status(400);
    }
}));
router.get("/api/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sql = "SELECT * FROM user";
        yield db.connection.query(sql, (error, result) => {
            if (error)
                throw error;
            else
                return res.status(200).json(result);
        });
    }
    catch (error) { }
}));
module.exports = router;

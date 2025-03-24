import express from "express";
import { registerUser, loginUser, updatePassword, updateUserInfo} from "../controllers/authController"; 

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/update-password", updatePassword);

router.put("/update-info", updateUserInfo);

export default router;

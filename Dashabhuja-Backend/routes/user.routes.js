import { Router } from "express";
import { createUser, getUserDetails, loginUser, updateTrustedContacts } from "../controller/user.controller.js";

const router = Router();

router.route("/signup").post(createUser);
router.route("/login").post(loginUser);
router.route("/get").get(getUserDetails);
router.route("/update").post(updateTrustedContacts);    

export default router
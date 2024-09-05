import { Router } from "express";
import { changeCreditCardDetails } from "../controller/creditCard.controller.js";
const router = Router();

router.route("/change-credit-card-details").post(changeCreditCardDetails);
export default router;

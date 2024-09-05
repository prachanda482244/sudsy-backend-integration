import express, { urlencoded } from "express";
import cors from "cors";
import { PORT } from "./config/constants.js";
import router from "./routes/creditCard.route.js";
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "20mb" }));
app.use(urlencoded({ extended: true, limit: "20mb" }));

app.use("/api/v1/credit-card", router);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

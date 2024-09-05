import { config } from "dotenv";
config();
export const PORT = process.env.PORT;
export const apiVersion = process.env.API_VERSION;
export const shop = process.env.SHOP;
export const accessToken = process.env.ACCESS_TOKEN;

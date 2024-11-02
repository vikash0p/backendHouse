import express from "express";
import { createHouse,getHouse,getHouseById } from "../controllers/houseController.js";
const HouseRouter = express.Router();

HouseRouter.post('/create',createHouse);
HouseRouter.get('/getAllHouse',getHouse);
HouseRouter.get('/getHouseById/:id',getHouseById);

export default HouseRouter;


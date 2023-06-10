const tourRouter=require("express").Router();
const jwt=require("jsonwebtoken");
const {verifyUserLoggedIn, checkRole} = require("../authenticate");
const { addtour, viewtour, deletetour, updateTour } = require("../Controller/TourController");




tourRouter.post("/add",verifyUserLoggedIn,addtour)
tourRouter.get("/view",verifyUserLoggedIn,viewtour)
tourRouter.put("/update",verifyUserLoggedIn,checkRole,updateTour)
tourRouter.delete("/delete/:id",verifyUserLoggedIn,verifyUserLoggedIn,deletetour)






module.exports=tourRouter
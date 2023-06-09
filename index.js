const express=require ("express");
const uRoutes = require("./Routes/userRoutes");
const tRoutes = require("./Routes/tourRoutes");
const bRoutes = require("./Routes/bRoutes");
const cRoutes = require("./Routes/cRoutes");
const pRoutes = require("./Routes/pRoutes");
const app=express();
const stripe = require("stripe")("sk_test_51N5keOESFgqQlsyzUyepxrlBjulvqwPcMbWvWtfvvPVqvwRG6JZ2q18fUpNFHiV1WfJ24cOUmz6Gbb9C5aSyy44O000prjxjFi")
const bodyParser = require("body-parser")
const cors = require("cors")





app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require("dotenv").config();


app.use(cors())
app.use(express.json())
const mongoose = require("mongoose"); 
app.use('/public', express.static(__dirname + '/public'));
mongoose.connect("mongodb+srv://hamza:123@cluster0.btxgzbp.mongodb.net/Project?retryWrites=true&w=majority").then(()=>{
    console.log("Connected")
}).catch(err=>{
   console.log(err) 
}) 

port=3001
app.listen(port, () => {
    console.log('App listening on port ' + port );
  });
  

app.use("/user",uRoutes); 
app.use("/tour",tRoutes); 
app.use("/tour",bRoutes); 
app.use("/customer",cRoutes);
app.use("/payment",pRoutes);  


import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app=express()
const port=3000;
app.use(express.static("public"));


app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/view/home.html");
});

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
})
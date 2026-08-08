const express=require("express");

const router=express.Router();

const {

generateReview

}=require("../controllers/ai.controller");

router.post("/generate-review",generateReview);

module.exports=router;
const express= require("express");
const router = express.Router();

router.get("/" , (req,res)=> {
 try{
  res.json({msg:"Rest api work !"})
 }
 catch(err){
  console.log(err);
  res.status(502).json({err})
 }
})

module.exports = router;
const router = require("express").Router()
const Message = require("../database/Message")

//add

router.post("/", async(req,res)=>{
    const newMessage = new Message(req.body)

    try{
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }catch(err){
        res.status(500).json(err)
    }

})

//get

router.get("/:convId",async(req,res)=>{

    try{
        const messages = await Message.find({
            conversationId:req.params.convId,
        })
        res.status(200).json(messages);

    }catch(err){
        res.status(500).json(err)
    }

})



module.exports = router;
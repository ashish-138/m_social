const router = require("express").Router();
const User = require("../database/User.js");
const bcrypt = require("bcrypt");


//update user
router.put("/:id", async(req,res)=>{
    
    if(req.body._id === req.params.id|| req.body.isAdmin){
        if(req.body.password){
            try{
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json("updated succesfully!")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your account!")
    }
})


//delete user
router.delete("/:id", async(req,res)=>{
if(req.body._id===req.params.id||req.body.isAdmin){
    try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("deleted successfully!")
    }catch(err){
        return res.status(500).json(err)
    }
}else{
    return res.status(403).json("you can delete only your account")
}
})

//get a user
router.get("/", async (req,res)=>{
    const userId =   req.query.userId;
    const username = req.query.username;
    try{
        const user = userId? await User.findById(userId): 
        await User.findOne({username:username});
        const {password, updatedAt, ...others} = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err)
    }
})


//get friends
router.get("/friends/:userId", async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId=>{
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map(friend=>{
            const {_id, username,profilePicture} = friend;
            friendList.push({_id, username, profilePicture})
        })
        res.status(200).json(friendList)
    }catch(err){
        res.status(500).json(err)
    }
})


//follow a user

router.put("/:id/follow", async(req,res)=>{
    
    if(req.body._id !== req.params.id){
        try{
            const currentUser = await User.findById(req.params.id);
            const user = await User.findById(req.body._id);
            if(!currentUser.followings.includes(req.body._id)){
                await user.updateOne({$push:{followers:req.params.id}});
                await currentUser.updateOne({$push:{followings:req.body._id}});
                res.status(200).json("user has been followed")
            }else{
                res.status(403).json("You have already Followed");
            }
        }catch(err){
            res.status(500).json("err")
        }
    }else{
        res.status(403).json("you can not follow yourself");
    }
})

//unfollow a user

router.put("/:id/unfollow", async(req,res)=>{
    
    if(req.body._id !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body._id);
            console.log(user)
            if(user.followers.includes(req.body._id)){
                await user.updateOne({$pull:{followers:req.body._id}});
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("You do not Follow the user");
            }
        }catch(err){
            res.status(500).json("err")
        }
    }else{
        res.status(403).json("you can not unfollow yourself");
    }
})

module.exports = router
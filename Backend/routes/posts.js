const router = require("express").Router();
const Post = require("../database/Post");
const User = require("../database/User");



//create a post

router.post("/",async(req,res)=>{
    const newPost = await new Post(req.body)
    try{
        const savePost = await newPost.save()
        res.status(200).json(savePost);
    }catch(err){
        res.status(500).json(err)
    }
})

//update a post

router.put("/:id", async(req,res)=>{
    try{
    const post = await Post.findById(req.params.id)
    if(post._id.toString()===req.body._id){
        const updatePost = await post.updateOne({$set:req.body})
        res.status(200).json("the post has been Updates")
    }else{
        res.status(403).json("You can only update your post")
    }
}catch(err){
    res.status(500).json(err);
}
})

//delete a post

router.delete("/:id", async(req,res)=>{
    try{
    const post = await Post.findById(req.params.id)
    if(post._id.toString()===req.body._id){
        await post.deleteOne({$set:req.body})
        res.status(200).json("the post has been Updates")
    }else{
        res.status(403).json("You can only delete your post")
    }
}catch(err){
    res.status(500).json(err);
}
})

//like a post

router.put("/:id/like",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body._id)){
        await post.updateOne({$push:{likes:req.body._id}});
        res.status(200).json("post has been liked")
        }else{
            await post.updateOne({$pull:{likes:req.body._id}});
            res.status(200).json("post has been disliked")
        }

    }catch(err){
        res.status(500).json(err);
    }
})
//get a post

router.get("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)

    }catch(err){
        res.status(500).json(err);
    }
})

//get timeline posts

router.get("/timeline/:userId", async(req,res)=>{
    try{
        const currenUser= await User.findById(req.params.userId);
        const userPost = await Post.find({userId:currenUser._id});
        console.log(userPost)
        const friendPosts = await Promise.all(
            currenUser.followings.map((friendId)=>{
              return Post.find({userId:friendId});
            })
        );

        res.status(200).json(userPost.concat(...friendPosts))

    }catch(err){
        res.status(500).json(err);
    }
})

//get user's all posts
router.get("/profile/:username", async(req,res)=>{
    try{
        const user= await User.findOne({username:req.params.username})
        const posts = await Post.find({userId: user._id});
        res.status(200).json(posts)

    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
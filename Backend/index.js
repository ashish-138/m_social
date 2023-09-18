const express = require("express")
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const DBconnection = require("./database/MDBconnection.js")
const userRoutes = require("./routes/users.js")
const authRoutes = require("./routes/auth.js")
const postsRoutes = require("./routes/posts.js")
const convernsationsRoutes = require("./routes/conversations.js")
const messageRoutes = require("./routes/messages.js")
const cors = require("cors");
const multer = require("multer");
const path = require("path")

// dotenv.config();

//Database connection
DBconnection();


app.use("/images", express.static(path.join(__dirname,"public/images")))

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images")
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name)
    }
})

const upload = multer({storage: storage});
app.post("/api/upload",upload.single("file"), (req,res)=>{
    try{
        return res.status(200).json("file uploaded successfully")
    }catch(err){
        console.log(err)
    }
});

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/posts",postsRoutes);
app.use("/api/conversations",convernsationsRoutes);
app.use("/api/messages",messageRoutes);




app.listen(8800,()=>{
    console.log("Backend is running!");
})
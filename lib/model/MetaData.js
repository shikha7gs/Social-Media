import mongoose from "mongoose"

const metaDataSchema = new mongoose.Schema({
    userName:{type:String,required:true,unique:true} ,
    banner:{type:String,default:"/banner.png"},
    pic:{type:String,default:"/user.png"},
    fullName:{type:String,required:true},
    profession:{type:String,default:"User"},
    description:{type:String,default:"A user of Social Media"},
    followers:{type:Array,default:[]},
    likePosts:{type:Array,default:[]},
    followings:{type:Array,default:[]}
}, { timestamps: true });

export const MetaData =
    mongoose.models.metadatas || mongoose.model("metadatas", metaDataSchema)
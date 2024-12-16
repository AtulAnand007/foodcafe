import mongoose from "mongoose";

/*export const  connectDB = async () =>{
    await mongoose.connect('mongodb+srv://anandatul089:atulAnand@clusterfood.mt3xu.mongodb.net/?retryWrites=true&w=majority&appName=ClusterFood').then(()=>console.log("DB Connected at katra"))
}*/


export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://food:Adarsh1007@cluster0.mqsmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>console.log("Mongodb connected to katra"))
}


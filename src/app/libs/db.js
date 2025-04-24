import mongoose from "mongoose";

const DBCon = async () => {
    try {
        await mongoose.connect(process.env.MONGODBURL);

        console.log('Mongo db is Connected');
    } catch (error) {
        console.log('Mongo db Faced Error', error);
    }
};

export default DBCon;

import mongoose from "mongoose";

const connect_to_db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("hehe OUR DB IS MEOWINGGGGG");
    } catch (error) {
        console.log("db not meowing rn ;(")
        console.log(error)

    }
}
export default connect_to_db;
import mongoose from "mongoose";

export const mongoDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Databse conneted successfuly");
    })
    .catch((error) => {
      console.log(`Error:${error.message}`);
    });
};

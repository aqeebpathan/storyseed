import { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  image: String,
  points: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
})

export const User = models.User || model("User", UserSchema)

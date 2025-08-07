import { model, models, Schema } from "mongoose"
import slugify from "slugify"

const LineSchema = new Schema({
  text: { type: String, required: true, maxlength: 150 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
})

const StorySchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  genre: { type: String },
  lines: [LineSchema],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
})

// Auto-generate slug on save or title update
StorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

export const Story = models.Story || model("Story", StorySchema)

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    unique: true,
    required: [true, "user name is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    minlength: [6, "password should be at least 6 characters long"],
    required: [true, "password is required"],
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    data: Buffer,
    type: String,
    contentType: String,
    required: false
  },
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

export default mongoose.model("users", userSchema);

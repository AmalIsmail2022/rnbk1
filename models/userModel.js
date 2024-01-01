const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "category required"],
      unique: [true, "category must be unique"],
      minlength: [3, "too short category name"],
      maxlength: [30, "too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
    password: {
      type: String,
      required: [true, "category required"],
      minlength: [6, "too short category name"],
      maxlength: [30, "too long category name"],
    },
    email: {
      type: String,
      required: [true, "category required"],
      unique: [true, "category must be unique"],
      lowercase: true,
    },
    // passwordChangeAt: Date,
    // passwordResetCode: String,
    // passwordResetExpires: Date,
    // passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
});


const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
    age: Number,
    gender: String,
    email: {
      type: String,
      required: [true, "category required"],
      unique: [true, "category must be unique"],
      lowercase: true,
    },
    phone: String,
    position: String,
    rating: Number,
  },
  { timestamps: true }
);
employeeSchema.post("init", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/employees/${doc.image}`;
    doc.image = imageUrl;
  }
});

employeeSchema.post("save", (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/employees/${doc.image}`;
    doc.image = imageUrl;
  }
});
// module.exports = mongoose.model("Student", employeeSchema);

const EmployeeModel = mongoose.model('Student', employeeSchema);
module.exports = EmployeeModel

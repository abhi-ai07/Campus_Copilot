import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "ERP",
        "Academic",
        "Examination",
        "Scholarship",
        "Library",
        "Admission",
        "General",
      ],
    },

    keywords: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;

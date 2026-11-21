import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import Notice from "./src/models/Notice.js";
import FAQ from "./src/models/FAQ.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    const notices = [
      {
        title: "End Semester Examination Schedule",
        description:
          "Students are advised to check the examination schedule and prepare accordingly.",
        category: "Examination",
        priority: "High",
      },
      {
        title: "Library Timing Update",
        description:
          "The college library will remain open from 9 AM to 5 PM on working days.",
        category: "General",
        priority: "Medium",
      },
    ];

    const faqs = [
      {
        question: "How can I access the college ERP portal?",
        answer:
          "Visit your college ERP portal and log in using your registered student credentials.",
        category: "ERP",
        keywords: ["ERP", "login", "portal"],
      },
      {
        question: "How can I check examination results?",
        answer:
          "Log in to the official student portal and navigate to the examination or results section.",
        category: "Examination",
        keywords: ["results", "exam", "marks"],
      },
      {
        question: "How can I borrow books from the library?",
        answer:
          "Visit the college library with your valid student ID card and follow the library's book issue procedure.",
        category: "Library",
        keywords: ["library", "books", "borrow"],
      },
    ];

    for (const notice of notices) {
      await Notice.updateOne(
        { title: notice.title },
        { $setOnInsert: notice },
        { upsert: true },
      );
    }

    for (const faq of faqs) {
      await FAQ.updateOne(
        { question: faq.question },
        { $setOnInsert: faq },
        { upsert: true },
      );
    }

    console.log("Sample data inserted successfully!");
  } catch (error) {
    console.error("Seed error:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seedData();

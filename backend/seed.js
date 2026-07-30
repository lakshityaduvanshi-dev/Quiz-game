require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Category = require("./models/Category");
const Question = require("./models/Question");

const run = async () => {
  await connectDB();

  console.log("Clearing existing categories and questions...");
  await Question.deleteMany({});
  await Category.deleteMany({});

  let admin = await User.findOne({ email: "admin@quizapp.com" });
  if (!admin) {
    admin = await User.create({
      name: "Quiz Admin",
      email: "admin@quizapp.com",
      password: "admin123",
      role: "admin",
    });
    console.log("Created admin user: admin@quizapp.com / admin123");
  }

  const categories = await Category.insertMany([
    { name: "General Knowledge", description: "A bit of everything", icon: "🧠", createdBy: admin._id },
    { name: "Science", description: "Physics, chemistry, biology", icon: "🔬", createdBy: admin._id },
    { name: "History", description: "People, places, events", icon: "🏛️", createdBy: admin._id },
    { name: "Sports", description: "Games and athletes", icon: "🏆", createdBy: admin._id },
  ]);

  const byName = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  const questions = [
    { category: byName["General Knowledge"], text: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correctOptionIndex: 2, difficulty: "easy" },
    { category: byName["General Knowledge"], text: "How many continents are there?", options: ["5", "6", "7", "8"], correctOptionIndex: 2, difficulty: "easy" },
    { category: byName["General Knowledge"], text: "Which language has the most native speakers?", options: ["English", "Mandarin Chinese", "Spanish", "Hindi"], correctOptionIndex: 1, difficulty: "medium" },
    { category: byName["Science"], text: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctOptionIndex: 1, difficulty: "easy" },
    { category: byName["Science"], text: "What is the chemical symbol for gold?", options: ["Ag", "Au", "Gd", "Go"], correctOptionIndex: 1, difficulty: "medium" },
    { category: byName["Science"], text: "What gas do plants primarily absorb for photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correctOptionIndex: 2, difficulty: "easy" },
    { category: byName["History"], text: "In what year did World War II end?", options: ["1943", "1945", "1947", "1950"], correctOptionIndex: 1, difficulty: "medium" },
    { category: byName["History"], text: "Who was the first President of the United States?", options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], correctOptionIndex: 2, difficulty: "easy" },
    { category: byName["Sports"], text: "How many players are on a standard soccer team on the field?", options: ["9", "10", "11", "12"], correctOptionIndex: 2, difficulty: "easy" },
    { category: byName["Sports"], text: "The Olympic Games are held every how many years?", options: ["2", "3", "4", "5"], correctOptionIndex: 2, difficulty: "easy" },
  ];

  await Question.insertMany(questions.map((q) => ({ ...q, createdBy: admin._id })));

  console.log(`Seeded ${categories.length} categories and ${questions.length} questions.`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

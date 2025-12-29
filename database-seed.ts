import { connectDB, getDB, getMongoClient } from "./src/presistence";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    const db = getDB();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [
        { username: "admin" },
        { email: "admin@admin.admin" }
      ]
    });

    if (existingUser) {
      console.log("User already exists, skipping insertion");
      return;
    }

    // Hash the password at runtime
    const password = "123456";
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Insert user if it doesn't exist
    const result = await usersCollection.insertOne({
      username: "admin",
      passwordHash: passwordHash,
      email: "admin@admin.admin",
    });

    console.log("User inserted successfully:", result.insertedId);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    // Close database connection
    const client = getMongoClient();
    await client.close();
    console.log("Database connection closed");
  }
}

// Run the seed function
seedDatabase();


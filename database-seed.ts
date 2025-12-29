import { connectDB, getDB, getMongoClient } from "./src/presistence";
import bcrypt from "bcryptjs";
import crypto from "crypto";

async function seedDatabase() {
  let client;
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to database");

    client = getMongoClient();
    const db = getDB();
    const usersCollection = db.collection("users");
    const inviteCodesCollection = db.collection("invitecodes");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      $or: [
        { username: "admin" },
        { email: "admin@admin.admin" }
      ]
    });

    if (existingUser) {
      console.log("User already exists, skipping insertion");
    } else {
      // Hash the password at runtime
      const password = "123456";
      const passwordHash = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");

      // Insert user if it doesn't exist
      const result = await usersCollection.insertOne({
        username: "admin",
        passwordHash: passwordHash,
        email: "admin@admin.admin",
        securityQuestion: "banana bread"
      });

      console.log("User inserted successfully:", result.insertedId);
    }

    let code = `INVITE-${crypto.randomBytes(6).toString('hex').toUpperCase()}`
    // Create invite code
    // Check if invite code already exists
    const existingInviteCode = await inviteCodesCollection.findOne({
      code: code
    });

    if (existingInviteCode) {
      code = `INVITE-${crypto.randomBytes(6).toString('hex').toUpperCase()}`
    }

    // Insert invite code
    await inviteCodesCollection.insertOne({
      code: code
    });

    console.log("Invite code inserted successfully:", code);

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    // Close database connection
    if (client) {
      await client.close();
      console.log("Database connection closed");
    }
  }
}

// Run the seed function
seedDatabase();  
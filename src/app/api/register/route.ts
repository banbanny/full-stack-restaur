import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

// Handle POST request for user registration
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    // Create a new user in the database with the hashed password
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Store the hashed password
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}

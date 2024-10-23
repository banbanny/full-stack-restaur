import { prisma } from "@/utils/connect";
import { NextResponse } from "next/server";

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

    // Create a new user in the database without hashing the password
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // Store the password in plaintext
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

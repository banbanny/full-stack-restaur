import { prisma } from "@/utils/connect";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);  // Same API as bcrypt

    try {
      // Create a new user in the database
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword, // Store the hashed password
        },
      });

      return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      return res.status(500).json({ message: "Error registering user" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

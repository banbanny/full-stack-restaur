// import { prisma } from "@/utils/connect";
// import { NextRequest, NextResponse } from "next/server";

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { orderId: string } }
// ) {
//   const { orderId } = params;

//   const order = await prisma.order.findUnique({
//     where: {
//       id: orderId,
//     },
//   });

//   if (order) {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: order.price * 100,
//       currency: "usd",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     await prisma.order.update({
//       where: {
//         id: orderId,
//       },
//       data: { intent_id: paymentIntent.id },
//     });

//     return new NextResponse(
//       JSON.stringify({ clientSecret: paymentIntent.client_secret }),
//       { status: 200 }
//     );
//   }
//   return new NextResponse(
//     JSON.stringify({ message:"Order not found!" }),
//     { status: 404 }
//   );
// }

import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  try {
    // Fetch the order from the database
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return new NextResponse(
        JSON.stringify({ message: "Order not found!" }),
        { status: 404 }
      );
    }

    // Ensure order.price is a number
    const amount = Math.round(Number(order.price) * 100); // Convert to cents

    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update the order in the database with the payment intent ID
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: { intent_id: paymentIntent.id },
    });

    // Return the client secret to the client
    return new NextResponse(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}

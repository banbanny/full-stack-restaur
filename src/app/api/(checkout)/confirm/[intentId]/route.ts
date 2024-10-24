import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { intentId: string } }) => {
  const { intentId } = params;

  try {
    // Debugging: Log the received intentId
    console.log("Received intentId:", intentId);

    // Perform the update operation
    const updatedOrder = await prisma.order.update({
      where: {
        intent_id: intentId,
      },
      
      data: { status: "Being prepared!" },
    });

    // Log the result of the update
    console.log("Order update result:", updatedOrder);

    // Respond with success message
    return NextResponse.json({ message: "Order has been updated" }, { status: 200 });
  } catch (err) {
    // Log any errors that occur during the update
    console.error("Error updating order:", err);

    // Respond with an error message
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
};

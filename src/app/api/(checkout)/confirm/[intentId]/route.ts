import { prisma } from "@/utils/connect";
import { NextResponse, NextRequest } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { intentId: string } }) => {
  const { intentId } = params;

  console.log("Received intentId:", intentId); // Debugging log

  try {
    const updatedOrder = await prisma.order.update({
      where: { intent_id: intentId },
      data: { status: "Being prepared!" },
    });
    
    console.log("Order update result:", updatedOrder); // Log result of the update

    return NextResponse.json({ message: "Order has been updated" }, { status: 200 });
  } catch (err) {
    console.log("Error during update:", err); // Detailed error log
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
};

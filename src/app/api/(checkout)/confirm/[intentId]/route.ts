import { prisma } from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, { params }: { params: { intentId: string } }) => {
  console.log("Received intentId:", params.intentId); // Add logs to debug

  try {
    const updatedOrder = await prisma.order.update({
      where: { intent_id: params.intentId },
      data: { status: "Being prepared!" },
    });
    console.log("Order updated successfully:", updatedOrder); // Add log for success
    return NextResponse.json({ message: "Order has been updated" }, { status: 200 });
  } catch (err) {
    console.log("Error occurred during Prisma query:", err); // Log error
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
};

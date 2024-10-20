"use client"; // Mark this component as a client component

import { ProductType } from "@/types/types";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation"; // Use next/navigation

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const Featured = () => {
  const router = useRouter(); // Initialize useRouter from next/navigation
  const [featuredProducts, setFeaturedProducts] = React.useState<ProductType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setFeaturedProducts(data);
    };
    fetchData();
  }, []);

  return (
    <div className="w-screen overflow-x-scroll text-red-500">
      {/* WRAPPER */}
      <div className="w-max flex">
        {/* SINGLE ITEM */}
        {featuredProducts.map((item) => (
          <div
            key={item.id}
            className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 hover:bg-fuchsia-50 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
          >
            {/* IMAGE CONTAINER */}
            {item.img && (
              <div className="relative flex-1 w-full transition-transform duration-500 hover:scale-110">
                <Image src={item.img} alt="" fill className="object-contain" />
              </div>
            )}
            {/* TEXT CONTAINER */}
            <div className=" flex-1 flex flex-col items-center justify-center text-center gap-4">
              <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">{item.title}</h1>
              <p className="p-4 2xl:p-8">{item.desc}</p>
              <span className="text-xl font-bold">₱{item.price}</span>
              <button 
                className="bg-red-500 text-white p-2 rounded-md"
                onClick={() => router.push("/login")} // Redirect to login on Add to Cart click
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;

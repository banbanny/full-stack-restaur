import { ActionTypes, CartType } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
  persist<CartType & ActionTypes>(
    (set, get) => ({
      products: INITIAL_STATE.products,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      
      addToCart(item) {
        const products = get().products;
        const productInState = products.find(
          (product) => product.id === item.id
        );

        if (productInState) {
          const updatedProducts = products.map((product) =>
            product.id === productInState.id
              ? {
                  ...productInState,
                  quantity: productInState.quantity + item.quantity,
                  price: productInState.price + item.price,
                }
              : product
          );
          const newTotalItems = get().totalItems + item.quantity;
          const newTotalPrice = get().totalPrice + item.price;

          set(() => ({
            products: updatedProducts,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          }));
        } else {
          set((state) => ({
            products: [...state.products, { ...item, quantity: item.quantity }],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price,
          }));
        }
      },

      removeFromCart: (product) =>
        set((state) => {
          const updatedProducts = state.products.filter((item) => item.id !== product.id);

          // If no products are left, set totalItems and totalPrice to 0
          if (updatedProducts.length === 0) {
            return {
              products: updatedProducts,
              totalItems: 0,
              totalPrice: 0,
            };
          }

          // Calculate new total items and total price after removal
          const updatedTotalItems = updatedProducts.reduce((acc, item) => acc + item.quantity, 0);
          const updatedTotalPrice = updatedProducts.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );

          return {
            products: updatedProducts,
            totalItems: updatedTotalItems,
            totalPrice: updatedTotalPrice,
          };
        }),
    }),
    { name: "cart", skipHydration: true }
  )
);

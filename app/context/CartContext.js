import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCommonHeaders } from "../services/getCommonHeaders";
import { useCredentials } from "./CredentialsContext";
import API_ENDPOINTS from "../config/config";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const STORE_API = process.env.STORE_API_URL;
  const DONATION_API = process.env.DONATION_API_URL;
  const { userToken } = useCredentials();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    if (loadedFromStorage) {
      saveCartToStorage();
      updateCartTotal();
    }
  }, [cart, loadedFromStorage]);

  const loadCartFromStorage = async () => {
    try {
      const cartData = await AsyncStorage.getItem("cart");
      if (cartData) {
        setCart(JSON.parse(cartData).filter((item) => item));
      }
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      setLoadedFromStorage(true);
      setLoading(false);
    }
  };

  const saveCartToStorage = async () => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart", error);
    }
  };

  const updateCartTotal = () => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setCartTotal(total.toFixed(2));
  };

  const addToCart = useCallback((item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && item.type === "store"
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter((cartItem) => cartItem.id !== itemId);
    });
  }, []);

  const deleteItemFromCart = useCallback((itemId) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== itemId)
    );
  }, []);

  const clearCart = useCallback(() => {
    AsyncStorage.removeItem("cart");
    setCart([]);
  }, []);

  const editItemPrice = useCallback((item, price) => {
    if (item.priceEditable === false) return;
    setCart((prevCart) => {
      return prevCart.map((cartItem) =>
        cartItem.id === item.id && cartItem.type === item.type
          ? { ...cartItem, price: price }
          : cartItem
      );
    });
  }, []);

  const fetchProductByID = useCallback(
    async (id, type) => {
      const url =
        type === "store"
          ? API_ENDPOINTS.STORE.GET_PRODUCT_BY_ID
          : API_ENDPOINTS.DONATION_OPERTUNITIES.GET_BY_ID;
      try {
        const response = await fetch(`${url}/${id}`, {
          headers: getCommonHeaders(userToken),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null;
      }
    },
    [STORE_API, DONATION_API]
  );

  const fetchCartData = useCallback(async () => {
    if (!loadedFromStorage) return;

    try {
      const data = await Promise.all(
        cart.map((item) => fetchProductByID(item.id, item.type))
      );

      setCart(
        data
          .map((product, index) => {
            const cartItem = cart[index];
            return {
              ...product,
              quantity: cartItem.quantity,
              screen: cartItem.screen,
              type: cartItem.type,
              price: cartItem.priceEditable ? cartItem.price : product.price,
              priceEditable: cartItem.priceEditable,
            };
          })
          .filter((product) => product)
      );
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  }, [cart, fetchProductByID, loadedFromStorage]);

  const isInCart = (id) => cart.some((item) => item.id === id);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isInCart,
        cartTotal,
        addToCart,
        removeFromCart,
        clearCart,
        deleteItemFromCart,
        editItemPrice,
        fetchCartData,
        loadedFromStorage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

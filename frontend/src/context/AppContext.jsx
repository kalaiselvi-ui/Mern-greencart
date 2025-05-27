import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  //fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/list");
      const { data } = response;
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //fetch seller status
  const fetchSellerStatus = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      console.log(error);
      setIsSeller(false);
    }
  };

  //fetch user status , user Data and Cart Items
  const fetchUserStatus = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch (error) {
      setUser(null);
    }
  };

  //add product to cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    console.log(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart");
  };
  //update cart item quantity
  const updatedCart = (itemId, quantity) => {
    let updatedCart = structuredClone(cartItems);
    if (quantity <= 0) {
      delete updatedCart[itemId]; // Remove item if quantity is 0 or less
    } else {
      updatedCart[itemId] = quantity; // Set new quantity
    }
    setCartItems(updatedCart);
    toast.success("Cart Updated");
  };
  //remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from cart");
    setCartItems(cartData);
  };

  //get cart total count
  const getCartCount = () => {
    // let totalCount = 0;
    // for (const item in cartItems) {
    //   totalCount += cartItems[item];
    // }
    return Object.values(cartItems).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  //get total cart amount
  const getTotalCartAmount = () => {
    // let totalAmount = 0;
    // for (const items in cartItems) {
    //   let itemInfo = products.find((product) => product._id === item);
    //   if (cartItems[items] > 0) {
    //     totalAmount += itemInfo.offerPrice * cartItems[items];
    //   }
    // }
    // return math.floor(totalAmount * 100) / 100;
    return Object.entries(cartItems)
      .reduce((total, [itemId, quantity]) => {
        const itemInfo = products.find((product) => product._id === itemId);
        if (itemInfo && quantity > 0) {
          return total + itemInfo.offerPrice * quantity;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUserStatus(); // First load user & cart
      await fetchSellerStatus(); // Then load seller info
      await fetchProducts(); // Finally load products
    };
    initialize();
  }, []);

  //update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (user) {
      updateCart();
    }
  }, [cartItems]);

  const value = {
    navigate,
    user,
    setUser,
    setIsSeller,
    isSeller,
    setShowUserLogin,
    showUserLogin,
    products,
    currency,
    addToCart,
    updatedCart,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getTotalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};

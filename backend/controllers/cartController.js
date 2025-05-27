import User from "../models/User.js";

//update user cartData : /api/cart/update
export const UpdateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    }
    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "cart updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

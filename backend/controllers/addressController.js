import express from "express";
import Address from "../models/Address.js";

//add address :/api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, message: "Unauthorized access" });
    }
    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Added Address" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//add address :/api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

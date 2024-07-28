const User = require('../models/userModel');
const Transaction =require('../models/transactionModel');



exports.registerUser =async(req, res) => {
  const { name, email,mobileNumber }= req.body;
  try {
    const userNew = new User({name,email,mobileNumber });
    await userNew.save();
    res.status(201).json({
      status: 'success',
      data: { userNew },
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

// Transfering  money 
exports.transferMoney = async (req, res) => {
  const { senderMobileNumber,receiverMobileNumber,amount } = req.body;
  try {
    const  sender =await User.findOne({mobileNumber:senderMobileNumber });
    const receiver = await User.findOne({ mobileNumber: receiverMobileNumber });

    if (!sender ||!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (sender.balance <amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    sender.balance-=amount;
    receiver.balance+=amount;

    await sender.save();
    await receiver.save();

    const transaction = new Transaction({
      sender:sender._id,
      receiver: receiver._id,
      amount,
    });
    await transaction.save();

    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.topUpBalance = async (req, res) => {
  const { mobileNumber, amount } = req.body;
  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.balance += amount;
    await user.save();
    res.status(200).json({ message: 'Top-up successful', balance: user.balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ mobileNumber: req.params.mobileNumber });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const user = await User.findOne({ mobileNumber: req.params.mobileNumber });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactions = await Transaction.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    }).populate('sender receiver');

    res.status(200).json({ data: transactions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

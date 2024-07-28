const  express = require('express');
const userController = require ('../controllers/userController');


const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/transfer',  userController.transferMoney);
router.post('/topup', userController.topUpBalance);
router.get('/user/:mobileNumber/transactions',userController.getTransactionHistory);
router.get('/user/:mobileNumber',userController.getUserDetails);

module.exports = router;

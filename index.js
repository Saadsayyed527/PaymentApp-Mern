const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors')

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(cors());

// console.log(PORT)
// database connection 
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("database connected")
})
.catch((error)=>{
    console.log(error)
})

app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
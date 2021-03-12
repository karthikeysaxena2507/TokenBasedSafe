const express = require("express");
const cors = require("cors");
const sequelize = require("./database/connection");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
const userRoutes = require("./routes/user.routes");
app.use("/users", userRoutes);


sequelize.sync()
.then(() => {
    app.listen(PORT, () => {
    console.log(`Express server started on ${PORT}`);
    });
})
.catch((error) => {
    console.log(error);
});
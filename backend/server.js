const express = require('express');
const regRouter = require('./router/regRouter');
const warhouseRouter = require('./router/warehouseRouter');
const goodsRouter = require("./router/goodsRouter");
const clientRoutes = require("./router/clientRouter");
const statsRoutes = require("./router/statsRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();

const PORT = 8000;
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api', regRouter);
app.use('/api', warhouseRouter);
app.use('/api', goodsRouter);
app.use('/api', clientRoutes);
app.use("/api", statsRoutes);

app.listen(PORT, () => console.log('listening on port ' + PORT));

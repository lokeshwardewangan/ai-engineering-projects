import express from 'express';
import 'dotenv/config';
import router from "./routes";

const app = express();

app.use(express.json());
app.use(router);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Sever is listening at http://localhost:${PORT}`);
});

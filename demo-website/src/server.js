import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes/router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const dbUrl = process.env.DB_URL;
const connect = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
await connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// เสิร์ฟ EJS ถ้าคุณยังใช้หน้า view
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

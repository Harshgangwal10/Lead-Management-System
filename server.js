import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import leadRoutes from "./routes/leadRoutes.js"
import 'dotenv/config'

const app = express();

const PORT = process.env.PORT;

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: [
  'http://localhost:3000',
 "https://lead-management-system-frontend-beta.vercel.app"
  ],
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('Lead Management Backend is running!');
});


app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);


app.get('/', (req, res) => {
  res.send('Lead Management Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})


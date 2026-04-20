import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database';
import cookieParser from 'cookie-parser';
import adminRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import postsRoutes from './modules/posts/posts.routes';
import petsRoutes from './modules/pets/pets.routes';
import osmRoutes from './modules/osm/osm.routes';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

const PORT = parseInt(process.env.PORT || '10000', 10);
const HOST = '0.0.0.0';

connectDB();

app.use('/api/auth', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/osm', osmRoutes);

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});

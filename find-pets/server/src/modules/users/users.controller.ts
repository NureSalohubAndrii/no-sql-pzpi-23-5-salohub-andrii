import { ExpressHandler } from '../../shared/types/express.types';
import * as userService from './users.service';

export const getMe: ExpressHandler = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID not found' });
      return;
    }

    const user = await userService.getUserById(userId);

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error in getMeController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

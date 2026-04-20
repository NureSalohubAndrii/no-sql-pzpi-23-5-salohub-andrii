import User from '../../database/models/user.model';
import { AppError } from '../../shared/utils/error.utils';

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) throw new AppError('User not found', 404);

  return user;
};

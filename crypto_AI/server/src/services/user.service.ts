import bcrypt from 'bcrypt';
import { env } from '../utils/env';
import { UserRepository, User, CreateUserData } from '../repos/user.repo';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async createUser(data: Omit<CreateUserData, 'password_hash'> & { password: string }): Promise<User> {
    const password_hash = await this.hashPassword(data.password);
    return this.userRepo.create({
      email: data.email,
      password_hash,
      first_name: data.first_name,
      last_name: data.last_name,
    });
  }

  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await this.verifyPassword(password, user.password_hash);
    return isValid ? user : null;
  }
}

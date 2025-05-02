import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usersRepository from "../users/users.repository";
import { RegisterUserDto } from "./dtos/register.dto";
import { LoginUserDto } from "./dtos/login.dto";
import config from "../../config";

const SALT_ROUNDS = 10;

class AuthService {
  async register(userData: RegisterUserDto) {
    const userExist = await usersRepository.findByEmail(userData.email);
    if (userExist) {
      throw new Error("Email already exist, try another one");
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const { password, ...restData } = userData;
    const createData = {
      ...restData,
      password_hash: hashedPassword,
    };

    const newUser = await usersRepository.createUser(createData);
    const { password_hash, ...userToReturn } = newUser;
    return { user: userToReturn };
  }

  async login(loginData: LoginUserDto) {
    const user = await usersRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error("Incorrect Email");
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginData.password,
      user.password_hash
    );
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password.");
    }

    const tokens = this.generateTokens({
      userId: user.user_id /*, role: user.role */,
    });

    const { password_hash, ...userToReturn } = user;
    return { user: userToReturn, ...tokens };
  }

  private generateTokens(payload: { userId: number }) {
    if (!config.jwt.secret) {
      throw new Error("JWT secret is not defined in configuration.");
    }

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);

    return { accessToken };
  }
}

export default new AuthService();

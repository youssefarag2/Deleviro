import prisma from "../../database/connect";

import { Prisma, User } from "@prisma/client";

class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });

    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = prisma.user.create({
      data: data,
    });

    return user;
  }
}

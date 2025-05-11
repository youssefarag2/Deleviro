import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  isString,
    IsEnum
} from "class-validator";
import { Role } from '@prisma/client';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsOptional() // Make phone optional to match schema
  phone_number?: string;

  @IsOptional() // Making it optional for general user registration
  @IsEnum(Role, { message: 'Invalid role. Must be one of: CUSTOMER, DRIVER, RESTAURANT_OWNER, ADMIN' })
  role?: Role;
  // HINT: Add any other fields required during registration (e.g., role if applicable)
  // HINT: These decorators are from class-validator and define validation rules.
}

import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  isString,
} from "class-validator";

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

  // HINT: Add any other fields required during registration (e.g., role if applicable)
  // HINT: These decorators are from class-validator and define validation rules.
}

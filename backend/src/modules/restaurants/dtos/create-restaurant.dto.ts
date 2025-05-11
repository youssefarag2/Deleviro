import {Type} from "class-transformer";
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsArray,
    ValidateNested,
    IsBoolean,
    IsPhoneNumber,
    IsEmail,
    IsUrl,
    IsObject,
    ArrayMinSize,
    MaxLength
} from 'class-validator';

import { CreateRestaurantAddressDto } from './create-restaurant-address.dto';

export class CreateRestaurantDto {
    @IsString()
    @IsNotEmpty({ message: 'Restaurant name cannot be empty.' })
    @MaxLength(255)
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    cuisine_type?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Invalid logo image URL.' })
    logo_image_url?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Invalid header image URL.' })
    header_image_url?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    price_range?: string;

    @IsOptional()
    @IsObject() // Or IsJSON() if you expect a JSON string. Use IsObject if client sends parsed object.
    operating_hours_info?: any;

    @IsOptional()
    // For Egypt, you might use a specific region code if class-validator supports it,
    // otherwise, a general phone number validation.
    @IsPhoneNumber('EG', { message: 'Invalid contact phone number.' }) // `null` for general format
    contact_phone?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Invalid contact email.' })
    contact_email?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean = true; // Defaults to true if not provided

    @IsArray()
    @ValidateNested({ each: true }) // Validates each object in the addresses array
    @ArrayMinSize(1, { message: 'At least one address is required.' }) // Must provide at least one address
    @Type(() => CreateRestaurantAddressDto) // Important for class-transformer to know the type of array elements
    addresses!: CreateRestaurantAddressDto[];
}
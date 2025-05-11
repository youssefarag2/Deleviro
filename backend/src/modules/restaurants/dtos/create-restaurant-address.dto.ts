import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsBoolean,
    MaxLength,
    Min,
    Max
} from 'class-validator';

export class CreateRestaurantAddressDto{
    @IsString()
    @IsNotEmpty({ message: 'Street address cannot be empty.' })
    @MaxLength(255)
    street_address1!:string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    street_address2?: string;

    @IsString()
    @IsNotEmpty({ message: 'City cannot be empty.' })
    @MaxLength(100)
    city!: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    state_province?: string; // e.g., 'Alexandria Governorate'

    @IsString()
    @IsNotEmpty({ message: 'Country cannot be empty.' })
    @MaxLength(100)
    country!: string; // e.g., 'Egypt'

    @IsOptional()
    @IsNumber()
    @Min(-90)
    @Max(90)
    latitude?: number;

    @IsOptional()
    @IsNumber()
    @Min(-180)
    @Max(180)
    longitude?: number;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    address_label?: string; // e.g., "Main Branch"

    @IsOptional()
    @IsBoolean()
    is_primary?: boolean = true; // Default the first address as primary for the restaurant
}


import {IsOptional, IsString, IsInt, Min, Max, IsNumberString} from "class-validator";
import {Type} from "class-transformer";

export class QueryRestaurantsDto {
    @IsOptional()
    @IsString()
    search?: string; // For searching by name/description

    @IsOptional()
    @IsString()
    cuisine?: string; // For filtering by cuisine type


    @IsOptional()
    @Type(() => Number) // Transform query string ('1', '2') to number
    @IsInt()
    @Min(1)
    page?: number = 1; // Default to page 1

    @IsOptional()
    @Type(() => Number) // Transform query string ('10', '20') to number
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10; // Default to 10 items per page


}
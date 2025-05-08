import restaurantsRepository from "./restaurants.repository";
import {QueryRestaurantsDto, SortOrder} from "./dtos/query-restaurants.dto";
import {Prisma, Restaurant} from '@prisma/client';
import prisma from "../../database/connect";

class RestaurantsService {
    async listRestaurants(query: QueryRestaurantsDto) {
        const {search, cuisine, page = 1, limit= 10, sortBy = 'name', sortOrder = SortOrder.ASC} = query;
        const skip = (page - 1) * limit;

        const where: Prisma.RestaurantWhereInput = {
            is_active: true,
            ...(search && {
                OR: [
                    {name: {contains: search}},
                    {description: {contains: search}}
                ]
            }),
            ...(cuisine && {cuisine_type: {contains: cuisine, mode: 'insensitive'}}),
            // Future: Add location-based filtering logic here
        };

        // ---- CONSTRUCT ORDER BY OBJECT ----
        let orderBy: Prisma.RestaurantOrderByWithRelationInput = {};
        const filedMap: {[key: string] : string} = {
            name: 'name',
            rating: 'average_rating',
            price: 'price'
        }
        const dbSortedField = filedMap[sortBy];
        if (dbSortedField) {
            orderBy = {[dbSortedField] : sortOrder}
        }else{
            orderBy = {name: 'asc'}
        }



        const [restaurants, total] = await Promise.all([
            restaurantsRepository.findMany({
                skip: skip,
                take: limit,
                where: where,
                orderBy: orderBy
            }),
            restaurantsRepository.count({where: where})
        ])

        const totalPages = Math.ceil(total / limit);
        return {
            data: restaurants,
            meta: {
                totalItems: total,
                itemCount: restaurants.length,
                itemsPerPage: limit,
                totalPages: totalPages,
                currentPage: page,
            }
        }
    }

    async getRestaurantById(id: number):Promise<Restaurant> {
        if(isNaN(id) || id <=0){
            throw new Error("Invalid restaurant id")
        }
        const restaurant = await restaurantsRepository.findById(id);
        if(!restaurant){
            throw new Error(`Restaurant not found.`);
        }
        return restaurant;
    }

}

export default new RestaurantsService();
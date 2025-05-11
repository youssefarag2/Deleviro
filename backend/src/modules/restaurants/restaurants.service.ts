import restaurantsRepository from "./restaurants.repository";
import {QueryRestaurantsDto, SortOrder} from "./dtos/query-restaurants.dto";
import {Prisma, Restaurant} from '@prisma/client';
import {CreateRestaurantDto} from "./dtos/create-restaurant.dto";

class RestaurantsService {
    async listRestaurants(query: QueryRestaurantsDto) {
        const {search, cuisine, page = 1, limit= 10, sortBy = 'name', sortOrder = SortOrder.ASC} = query;
        const skip = (page - 1) * limit;

        const where: Prisma.RestaurantWhereInput = {
            is_active: true,
            ...(search && {
                OR: [
                    {name: {contains: search, mode: 'insensitive'}},
                    {description: {contains: search, mode: 'insensitive'}},
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
            price: 'price_range'
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

    async createRestaurant(createRestaurantDto: CreateRestaurantDto, ownerUserId: number): Promise<Restaurant>{
        // Business logic like checking for duplicate restaurant names by the same owner
        const existing = await restaurantsRepository.findMany({
            where :{name: createRestaurantDto.name, owner_user_id: ownerUserId}
        })

        if(existing.length >0){
            throw new Error('You already own restaurant with this name.') // Will become 409 Conflict
        }

        // Prepare data for Prisma, including the nested create for addresses
        const dataToCreate: Prisma.RestaurantCreateInput = {
            name: createRestaurantDto.name,
            description: createRestaurantDto.description,
            cuisine_type: createRestaurantDto.cuisine_type,
            logo_image_url: createRestaurantDto.logo_image_url,
            header_image_url: createRestaurantDto.header_image_url,
            price_range: createRestaurantDto.price_range,
            operating_hours_info: createRestaurantDto.operating_hours_info,
            contact_phone: createRestaurantDto.contact_phone,
            contact_email: createRestaurantDto.contact_email,
            is_active: createRestaurantDto.is_active ! == undefined ? createRestaurantDto.is_active : true,
            owner:{
                connect:{
                    user_id: ownerUserId,
                }
            },
            addresses:{
                create: createRestaurantDto.addresses.map(addr => ({
                    street_address1: addr.street_address1,
                    street_address2: addr.street_address2,
                    city: addr.city,
                    state_province: addr.state_province,
                    country: addr.country,
                    latitude: addr.latitude,
                    longitude: addr.longitude,
                    address_label: addr.address_label,
                    is_primary: addr.is_primary,
                    // user_id is left null as this address belongs to the restaurant
                })),
            }

        }
        return await restaurantsRepository.create(dataToCreate);

    }

}

export default new RestaurantsService();
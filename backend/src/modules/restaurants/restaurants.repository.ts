import prisma from "../../database/connect";
import { Restaurant, Prisma } from "@prisma/client";


class RestaurantRepository {
    async findMany(options: {
        where?: Prisma.RestaurantWhereInput;
        skip?: number;
        take?: number;
        orderBy?: Prisma.RestaurantOrderByWithRelationInput
    }) : Promise <Restaurant[]> {
         return prisma.restaurant.findMany({
            where: options.where,
            skip: options.skip,
            take: options.take,
            orderBy: options.orderBy
        })
    }

    async count(options: {
        where?: Prisma.RestaurantWhereInput;
    }) : Promise<number> {
        return prisma.restaurant.count({
            where: options.where
        })
    }

    async findById(id: number) : Promise<Restaurant | null> {
        return prisma.restaurant.findUnique({
            where: {
                restaurant_id: id
            }
        })
    }

    // ADD methods for create, update later

    async create(restaurantData: Prisma.RestaurantCreateInput): Promise<Restaurant>{
        return prisma.restaurant.create({
            data: restaurantData
        })
    }

    async update(restaurantId: number, updateData: Prisma.RestaurantUpdateInput): Promise<Restaurant>{
        return prisma.restaurant.update({where: {restaurant_id: restaurantId}, data: updateData})
    }

    async delete(restaurantId: number): Promise<Restaurant>{
        return prisma.restaurant.delete({where: {restaurant_id: restaurantId}})
    }
}

export default new RestaurantRepository();
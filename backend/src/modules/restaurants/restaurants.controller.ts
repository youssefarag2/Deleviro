import{Request, Response, NextFunction} from 'express';
import RestaurantsService from "./restaurants.service";
import { QueryRestaurantsDto } from "./dtos/query-restaurants.dto";
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import {Role} from "@prisma/client";

class RestaurantsController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = (req as any).validatedData as QueryRestaurantsDto;
            const restaurants = await RestaurantsService.listRestaurants(query);
            res.status(200).json(restaurants);
        }catch (error){
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.restaurantID, 10);
            const restaurant = await RestaurantsService.getRestaurantById(id);
            res.status(200).json(restaurant);
        }catch (error){
            next(error);
        }
    }

    async Create(req: Request, res: Response, next: NextFunction) {
        try{
            if(!req.user){
                const err = new Error("Authentication required");
                (err as any).status = 401;
                throw err
            }

            if(req.user.role !== Role.RESTAURANT_OWNER && req.user.role !== Role.ADMIN){
                const err = new Error("Forbidden: You do not have permission to create a restaurant.");
                (err as any).status = 401;
                throw err
            }

            const createRestaurantDto = (req as any).validatedData as CreateRestaurantDto;
            const ownerId = req.user.userId

            const newRestaurant = await RestaurantsService.createRestaurant(createRestaurantDto, ownerId);
            res.status(201).json({
                message: "Restaurant created successfully",
                data: newRestaurant
            })

        }catch (error){
            next(error);
        }
    }

    // Add create/update controllers later
}


export default new RestaurantsController();
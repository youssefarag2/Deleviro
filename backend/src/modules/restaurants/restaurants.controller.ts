import{Request, Response, NextFunction} from 'express';
import RestaurantsService from "./restaurants.service";
import { QueryRestaurantsDto } from "./dtos/query-restaurants.dto";

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

    // Add create/update controllers later
}


export default new RestaurantsController();
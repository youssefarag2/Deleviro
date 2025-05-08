import { Router } from "express";
import restaurantsController from "./restaurants.controller";
import { validateRequest } from "../../middleware/request.validator";
import { QueryRestaurantsDto } from "./dtos/query-restaurants.dto";

const router = Router()


router.get("/",
    validateRequest(QueryRestaurantsDto, "query"),
    restaurantsController.getAll)


router.get("/:restaurantID",
    restaurantsController.getOne)

// Add POST, PUT, DELETE routes later for creation/updates


export default router;
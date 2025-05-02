// src/middleware/request.validator.ts

import { Request, Response, NextFunction, RequestHandler } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance, ClassConstructor } from "class-transformer";

/**
 * Formats validation errors into a simpler array of messages.
 * Handles nested errors recursively.
 * @param errors Array of ValidationError objects from class-validator.
 * @returns A flat array of error message strings.
 */
function formatValidationErrors(errors: ValidationError[]): string[] {
  let messages: string[] = [];
  errors.forEach((err) => {
    // Add constraints messages from the current level
    if (err.constraints) {
      messages = messages.concat(Object.values(err.constraints));
    }
    // Recursively add messages from nested validation errors
    if (err.children && err.children.length > 0) {
      messages = messages.concat(formatValidationErrors(err.children));
    }
  });
  return messages;
}

/**
 * Express middleware generator function to validate request data against a DTO class.
 *
 * @template T Type of the DTO class (must be an object).
 * @param {ClassConstructor<T>} dtoClass The DTO class definition with class-validator decorators.
 * @param {'body' | 'query' | 'params'} source The part of the request object to validate ('body', 'query', or 'params'). Defaults to 'body'.
 * @param {boolean} [skipMissingProperties=false] If true, skips validation for properties that are missing in the input object. Defaults to false.
 * @returns {RequestHandler} An Express middleware function.
 */
export function validateRequest<T extends object>(
  dtoClass: ClassConstructor<T>,
  source: "body" | "query" | "params" = "body",
  skipMissingProperties = false
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // 1. Select the data source from the request object
    const dataToValidate = req[source];

    // 2. Convert the plain JavaScript object from the request into an instance of our DTO class.
    // This step is crucial for class-validator to work correctly with decorators.
    // It also applies any transformations defined by @Transform() decorators in the DTO.
    const dtoInstance: T = plainToInstance(dtoClass, dataToValidate);

    // 3. Validate the DTO instance against the validation rules defined in the class.
    const errors: ValidationError[] = await validate(dtoInstance, {
      skipMissingProperties, // Skip validation for properties not present in the input object if true
      whitelist: true, // Automatically remove any properties from the input object that do not have decorators in the DTO class
      forbidNonWhitelisted: true, // Throw an error if properties without any decorators are present in the input object
    });

    // 4. Check if any validation errors occurred.
    if (errors.length > 0) {
      // Format the errors into a user-friendly array of messages
      const errorMessages = formatValidationErrors(errors);
      // Send a 400 Bad Request response with the validation error messages
      res.status(400).json({
        statusCode: 400,
        message: `Input validation failed (${source})`,
        errors: errorMessages,
      });
      // Stop further processing by not calling next()
      return;
    }

    // 5. If validation passes, overwrite the original request data (body, query, or params)
    //    with the validated (and potentially transformed) DTO instance.
    //    This ensures the controller receives clean, validated data.
    req[source] = dtoInstance;

    // 6. Pass control to the next middleware or route handler in the chain.
    next();
  };
}

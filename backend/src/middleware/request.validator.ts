// src/middleware/request.validator.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';

// Helper function to format errors (can be kept the same)
function formatValidationErrors(errors: ValidationError[]): string[] {
  // ... (implementation from previous response) ...
  let messages: string[] = [];
  errors.forEach((err) => {
    if (err.constraints) {
      messages = messages.concat(Object.values(err.constraints));
    }
    if (err.children && err.children.length > 0) {
      messages = messages.concat(formatValidationErrors(err.children));
    }
  });
  return messages;
}


// // Optional: Define an extended Request type for better type safety in controllers
// export interface RequestWithValidatedData extends Request {
//   validatedData?: any; // Or use a Generic T if you prefer stricter typing here
// }


export function validateRequest<T extends object>(
    dtoClass: ClassConstructor<T>,
    source: 'body' | 'query' | 'params' = 'body',
    skipMissingProperties = false
): RequestHandler {
  // Use the extended Request type or cast req later
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dataToValidate = req[source];
    const dtoInstance: T = plainToInstance(dtoClass, dataToValidate);
    const errors: ValidationError[] = await validate(dtoInstance, {
      skipMissingProperties,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const errorMessages = formatValidationErrors(errors);
      res.status(400).json({
        statusCode: 400,
        message: `Input validation failed (${source})`,
        errors: errorMessages,
      });
      return;
    }

    // ---- CHANGE HERE ----
    // Attach the validated instance to a custom property instead of overwriting req[source]
    // We use 'any' type assertion for simplicity, or use the extended Request type
    (req as any).validatedData = dtoInstance;
    // ---- END CHANGE ----

    next();
  };
}
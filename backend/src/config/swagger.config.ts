// src/config/swagger.config.ts
import { Options } from 'swagger-jsdoc';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
// Import this to ensure class-validator's metadata storage is populated before generating schemas.
// It might seem unused, but its import can trigger metadata registration.
import { getMetadataStorage } from 'class-validator';
// --- Import your DTO classes ---
import { RegisterUserDto } from '../modules/auth/dtos/register.dto';
import { LoginUserDto } from '../modules/auth/dtos/login.dto';

// Ensure class-validator metadata is available
// This line forces class-validator to build its metadata if it hasn't already.
// It's a bit of a workaround but often necessary for class-validator-jsonschema.
const _ = (getMetadataStorage as any).validationMetadatas;

const generatedSchemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
});

const swaggerOptions: Options = {
    definition: {
        openapi: '3.0.0', // OpenAPI version
        info: {
            title: 'Food Delivery API',
            version: '1.0.0',
            description: 'API documentation for the Food Delivery application.',
            contact: {
                name: 'API Support',
                // url: 'http://www.example.com/support', // Your support URL
                email: 'support@example.com', // Your support email
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}/api/v1`, // Your base API URL
                description: 'Development server',
            },
            // You can add more servers (e.g., staging, production)
        ],
        // Define components like securitySchemes, schemas (DTOs) globally
        components: {
            securitySchemes: {
                bearerAuth: { // Name of the security scheme
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Optional, for documentation
                },
            },
            // You'll define your DTOs and model responses as schemas here
            // or reference them from JSDoc annotations using $ref
            schemas: {
                ...generatedSchemas
                // Example - you'll define these based on your DTOs/Models
                // RegisterUserDto: { ... OpenAPI schema for RegisterUserDto ... },
                // LoginUserDto: { ... OpenAPI schema for LoginUserDto ... },
                // UserResponse: { ... OpenAPI schema for user response (without password) ... },
                // Restaurant: { ... OpenAPI schema for Restaurant model ... },
                // ErrorResponse: { type: 'object', properties: { message: {type: 'string'}, errors: { type: 'array', items: {type: 'string'}}}}
            },
        },
        paths: {}
    },
    // Path to the API specs (your route files or controller files with JSDoc comments)
    apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.dtos.ts'], // Adjust path as needed
};

export default swaggerOptions;
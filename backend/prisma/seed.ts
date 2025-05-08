// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Define Your Sample Data ---

// Example Restaurants (Egyptian Context)
const restaurantsToCreate = [
    {
        name: 'Gad Restaurant (Smouha)',
        description: 'Classic Egyptian fast food and staples. Known for foul and falafel.',
        cuisine_type: 'Egyptian, Fast Food',
        price_range: 'EGP 20-80',
        operating_hours_info: { Mon: "7am-2am", Tue: "7am-2am", Wed: "7am-2am", Thu: "7am-2am", Fri: "7am-3am", Sat: "7am-3am", Sun: "7am-2am" },
        contact_phone: '03-4201111', // Example
        is_active: true,
        // owner_user_id: null, // Assuming optional owner for seeding simplicity
        // Address(es) linked below
        addresses: [
            { street_address1: '10 Fawzy Moaz St', city: 'Alexandria', state_province: 'Alexandria Governorate', country: 'Egypt', postal_code: '21615', latitude: 31.2233, longitude: 29.9567, address_label: 'Smouha Branch' },
        ]
    },
    {
        name: 'Abou Anas Al-Shamy (Miami)',
        description: 'Famous Syrian shawerma and grilled dishes.',
        cuisine_type: 'Syrian, Grills, Shawerma',
        price_range: 'EGP 40-150',
        is_active: true,
        operating_hours_info: { "Everyday": "11am-3am" },
        addresses: [
            { street_address1: '45 Gamal Abdel Nasser Rd, Miami', city: 'Alexandria', state_province: 'Alexandria Governorate', country: 'Egypt', postal_code: '21929', latitude: 31.2800, longitude: 30.0011, address_label: 'Miami Branch' },
            // Could add more addresses here if testing multiple branches for one restaurant
        ]
    },
    {
        name: 'Hosny For Seafood (Bahary)',
        description: 'Well-known spot for fresh seafood with sea views.',
        cuisine_type: 'Seafood, Egyptian',
        price_range: 'EGP 100-400',
        is_active: true,
        addresses: [
            { street_address1: 'Qaitbay St, Anfoushi', city: 'Alexandria', state_province: 'Alexandria Governorate', country: 'Egypt', postal_code: '21599', latitude: 31.2130, longitude: 29.8850, address_label: 'Bahary Main' }
        ]
    },
    {
        name: 'Balbaa Village (Sidi Gaber)',
        description: 'Large venue offering diverse grills and Egyptian cuisine.',
        cuisine_type: 'Egyptian, Grills, Middle Eastern',
        price_range: 'EGP 80-250',
        is_active: true,
        addresses: [
            { street_address1: 'Near Sidi Gaber Station', city: 'Alexandria', state_province: 'Alexandria Governorate', country: 'Egypt', postal_code: '21529', latitude: 31.2195, longitude: 29.9417 }
        ]
    },
    {
        name: 'Pizza King (Inactive Branch)',
        description: 'Pizza place - currently inactive test.',
        cuisine_type: 'Pizza, Italian',
        price_range: 'EGP 50-200',
        is_active: false, // Example of inactive restaurant
        addresses: [
            { street_address1: '1 Test St', city: 'Alexandria', state_province: 'Alexandria Governorate', country: 'Egypt', postal_code: '00000' }
        ]
    }
];

// --- Main Seeding Function ---
async function main() {
    console.log(`🧹 Cleaning old data...`); // Optional: Clean data before seeding
    // Be careful with deleteMany in production seeds!
    // Order matters due to foreign keys - delete related records first.
    await prisma.address.deleteMany(); // Delete addresses linked to restaurants
    await prisma.restaurant.deleteMany(); // Delete restaurants

    console.log(`🌱 Start seeding Restaurants and Addresses...`);

    for (const restaurantData of restaurantsToCreate) {
        // Separate address data from restaurant data
        const { addresses, ...restData } = restaurantData;

        // Create the restaurant record
        const restaurant = await prisma.restaurant.create({
            data: restData, // Use data without addresses array
        });
        console.log(`Created restaurant: ${restaurant.name} (ID: ${restaurant.restaurant_id})`);

        // Create associated addresses and link them
        if (addresses && addresses.length > 0) {
            for (const addr of addresses) {
                await prisma.address.create({
                    data: {
                        ...addr,
                        restaurant_id: restaurant.restaurant_id, // Set the foreign key
                    },
                });
                console.log(` -> Created address: ${addr.street_address1}`);
            }
        }
    }

    console.log(`Seeding finished. 🌱`);
}

// --- Execute the Main Function ---
main()
    .then(async () => {
        // Disconnect Prisma Client on success
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        // Log errors and disconnect Prisma Client on failure
        console.error('🔴 Seeding failed:', e);
        await prisma.$disconnect();
        process.exit(1); // Exit with error code
    });
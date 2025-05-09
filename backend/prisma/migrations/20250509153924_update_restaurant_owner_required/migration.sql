/*
  Warnings:

  - Made the column `owner_user_id` on table `restaurants` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_owner_user_id_fkey";

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "owner_user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

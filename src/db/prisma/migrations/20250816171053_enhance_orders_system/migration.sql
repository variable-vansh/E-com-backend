/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerPhone` to the `orders` table without a default value. This is not possible if the table is not empty.
  - The required column `orderId` was added to the `orders` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "productName" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customerPhone" TEXT NOT NULL,
ADD COLUMN     "deliveryFee" DOUBLE PRECISION,
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "fullAddress" TEXT,
ADD COLUMN     "grandTotal" DOUBLE PRECISION,
ADD COLUMN     "houseNumber" TEXT,
ADD COLUMN     "itemTotal" DOUBLE PRECISION,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN     "orderTimestamp" TIMESTAMP(3),
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "street" TEXT,
ALTER COLUMN "orderNumber" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "customerEmail" DROP NOT NULL,
ALTER COLUMN "shippingAddress" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "order_mix_items" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "grainId" INTEGER,
    "grainName" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_mix_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "orders"("orderId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_mix_items" ADD CONSTRAINT "order_mix_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

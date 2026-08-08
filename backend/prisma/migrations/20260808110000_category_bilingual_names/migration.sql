-- AlterTable
ALTER TABLE "categories" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN "nameAr" TEXT NOT NULL,
ADD COLUMN "nameEn" TEXT NOT NULL;

-- DropIndex
DROP INDEX IF EXISTS "categories_name_key";
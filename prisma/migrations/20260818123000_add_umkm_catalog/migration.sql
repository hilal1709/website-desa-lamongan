CREATE TABLE "Umkm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "address" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Umkm_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UmkmProduct" (
    "id" TEXT NOT NULL,
    "umkmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UmkmProduct_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Umkm_slug_key" ON "Umkm"("slug");
CREATE INDEX "Umkm_isPublished_category_idx" ON "Umkm"("isPublished", "category");
CREATE INDEX "UmkmProduct_umkmId_isAvailable_idx" ON "UmkmProduct"("umkmId", "isAvailable");

ALTER TABLE "UmkmProduct" ADD CONSTRAINT "UmkmProduct_umkmId_fkey" FOREIGN KEY ("umkmId") REFERENCES "Umkm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

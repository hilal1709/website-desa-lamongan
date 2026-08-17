CREATE TABLE "CmsPageStore" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsPageStore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CmsNewsStore" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmsNewsStore_pkey" PRIMARY KEY ("id")
);

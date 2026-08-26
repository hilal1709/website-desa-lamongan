CREATE TABLE "SiteSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "villageName" TEXT NOT NULL DEFAULT 'Desa Kedungrejo',
    "district" TEXT NOT NULL DEFAULT 'Kecamatan Modo',
    "regency" TEXT NOT NULL DEFAULT 'Kabupaten Lamongan',
    "province" TEXT NOT NULL DEFAULT 'Jawa Timur',
    "officeAddress" TEXT NOT NULL DEFAULT 'Jl. Raya Kedungrejo No. 01',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "serviceHours" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL DEFAULT 'Mewujudkan pelayanan publik yang terbuka, tanggap, dan dekat dengan warga.',
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "youtubeUrl" TEXT,
    "siteTitle" TEXT NOT NULL DEFAULT 'Desa Kedungrejo',
    "siteDescription" TEXT NOT NULL DEFAULT 'Website resmi Desa Kedungrejo',
    "publicAnnouncement" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

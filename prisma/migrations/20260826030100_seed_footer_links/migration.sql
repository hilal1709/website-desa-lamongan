UPDATE "SiteSetting"
SET "footerLinks" = '[
  {"label":"Profil Desa","href":"/profil"},
  {"label":"Berita Desa","href":"/berita"},
  {"label":"Layanan Publik","href":"/layanan"},
  {"label":"Data Desa","href":"/infografis"}
]'::jsonb
WHERE "id" = 1 AND "footerLinks" = '[]'::jsonb;

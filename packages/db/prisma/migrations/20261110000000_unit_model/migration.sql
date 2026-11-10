-- Migrasi v1.7: PropertyDesign -> Unit + UnitMedia (docs/04-data-model.md §3.3)

-- 1. Enum baru
CREATE TYPE "UnitPublishStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "UnitSalesStatus" AS ENUM ('AVAILABLE', 'INDENT', 'SOLD');
CREATE TYPE "UnitMediaKind" AS ENUM ('RENDER', 'FLOOR_PLAN', 'PHOTO', 'SITE_PLAN', 'VIDEO');

-- 2. Tabel unit
CREATE TABLE "unit" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "unitCode" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "floors" INTEGER NOT NULL DEFAULT 1,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "carports" INTEGER NOT NULL DEFAULT 0,
    "buildingAreaM2" INTEGER NOT NULL,
    "landAreaM2" INTEGER NOT NULL,
    "priceFrom" BIGINT,
    "estimatedBuildCostMin" BIGINT,
    "estimatedBuildCostMax" BIGINT,
    "publishStatus" "UnitPublishStatus" NOT NULL DEFAULT 'DRAFT',
    "salesStatus" "UnitSalesStatus" NOT NULL DEFAULT 'AVAILABLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- 3. Salin data lama; proyek fallback bila desain lama belum punya proyek.
INSERT INTO "unit" (
    "id", "slug", "unitCode", "typeName", "title", "subtitle", "description",
    "projectId", "floors", "bedrooms", "bathrooms", "carports", "buildingAreaM2",
    "landAreaM2", "priceFrom", "estimatedBuildCostMin", "estimatedBuildCostMax",
    "publishStatus", "salesStatus", "featured", "viewCount", "publishedAt",
    "seoTitle", "seoDescription", "createdAt", "updatedAt", "deletedAt"
)
SELECT
    "id",
    "slug",
    upper("slug") AS "unitCode",
    "style" AS "typeName",
    "title",
    "subtitle",
    "description",
    COALESCE("projectId", (SELECT min("id") FROM "project")) AS "projectId",
    "floors",
    "bedrooms",
    "bathrooms",
    "carports",
    "buildingAreaM2",
    "landAreaMinM2" AS "landAreaM2",
    "priceFrom",
    "estimatedBuildCostMin",
    "estimatedBuildCostMax",
    "status"::text::"UnitPublishStatus" AS "publishStatus",
    'AVAILABLE'::"UnitSalesStatus" AS "salesStatus",
    "featured",
    "viewCount",
    "publishedAt",
    "seoTitle",
    "seoDescription",
    "createdAt",
    "updatedAt",
    "deletedAt"
FROM "property_design";

SELECT setval(pg_get_serial_sequence('"unit"', 'id'), COALESCE((SELECT max("id") FROM "unit"), 0) + 1, false);

-- 4. Tabel unit_media + salin media lama
CREATE TABLE "unit_media" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "kind" "UnitMediaKind" NOT NULL DEFAULT 'RENDER',
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unit_media_pkey" PRIMARY KEY ("id")
);

INSERT INTO "unit_media" (
    "unitId", "kind", "storageKey", "url", "alt", "width", "height",
    "sortOrder", "isCover", "createdAt"
)
SELECT
    "designId" AS "unitId",
    CASE "kind"::text
        WHEN 'IMAGE' THEN 'PHOTO'::"UnitMediaKind"
        WHEN 'RENDER_3D' THEN 'RENDER'::"UnitMediaKind"
        WHEN 'FLOOR_PLAN' THEN 'FLOOR_PLAN'::"UnitMediaKind"
        WHEN 'VIDEO' THEN 'VIDEO'::"UnitMediaKind"
        ELSE 'PHOTO'::"UnitMediaKind"
    END AS "kind",
    "storageKey",
    "url",
    "alt",
    "width",
    "height",
    "sortOrder",
    "isCover",
    "createdAt"
FROM "property_design_media";

-- 5. Lead -> unitId dan LeadType baru
ALTER TABLE "lead" ADD COLUMN "unitId" INTEGER;
UPDATE "lead" SET "unitId" = "designId";

CREATE TYPE "LeadType_new" AS ENUM ('BUY_UNIT', 'LAND_OFFER', 'GENERAL');
ALTER TABLE "lead" ALTER COLUMN "type" TYPE "LeadType_new" USING (
    CASE "type"::text
        WHEN 'BUY_DESIGN' THEN 'BUY_UNIT'
        WHEN 'INVEST' THEN 'GENERAL'
        ELSE "type"::text
    END
)::"LeadType_new";
DROP TYPE "LeadType";
ALTER TYPE "LeadType_new" RENAME TO "LeadType";

ALTER TABLE "lead" DROP CONSTRAINT "lead_designId_fkey";
DROP INDEX "lead_designId_idx";
ALTER TABLE "lead" DROP COLUMN "designId";

-- 6. FunnelEvent -> unitId
ALTER TABLE "funnel_event" RENAME COLUMN "designId" TO "unitId";
ALTER INDEX "funnel_event_designId_idx" RENAME TO "funnel_event_unitId_idx";

-- 7. Hapus model investasi
DROP TABLE "investment_interest";
DROP TYPE "InvestmentInstrument";
DROP TYPE "BudgetRange";
DROP TYPE "RiskProfile";

-- 8. Hapus struktur desain lama
DROP TABLE "design_tag_on_design";
DROP TABLE "design_tag";
DROP TABLE "property_design_media";
DROP TABLE "property_design";
DROP TYPE "DesignCategory";
DROP TYPE "DesignStatus";
DROP TYPE "MediaKind";

-- 9. Index & constraint unit
CREATE UNIQUE INDEX "unit_slug_key" ON "unit"("slug");
CREATE UNIQUE INDEX "unit_projectId_unitCode_key" ON "unit"("projectId", "unitCode");
CREATE INDEX "unit_publishStatus_publishedAt_idx" ON "unit"("publishStatus", "publishedAt");
CREATE INDEX "unit_projectId_publishStatus_idx" ON "unit"("projectId", "publishStatus");
CREATE INDEX "unit_salesStatus_publishStatus_idx" ON "unit"("salesStatus", "publishStatus");
CREATE INDEX "unit_typeName_idx" ON "unit"("typeName");
CREATE INDEX "unit_deletedAt_idx" ON "unit"("deletedAt");
CREATE INDEX "unit_media_unitId_sortOrder_idx" ON "unit_media"("unitId", "sortOrder");
CREATE INDEX "lead_unitId_idx" ON "lead"("unitId");

ALTER TABLE "unit" ADD CONSTRAINT "unit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "unit_media" ADD CONSTRAINT "unit_media_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lead" ADD CONSTRAINT "lead_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

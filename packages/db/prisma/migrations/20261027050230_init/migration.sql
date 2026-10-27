-- CreateEnum
CREATE TYPE "DesignCategory" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'RENOVATION', 'INTERIOR');

-- CreateEnum
CREATE TYPE "DesignStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('IMAGE', 'FLOOR_PLAN', 'RENDER_3D', 'VIDEO');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('BUY_DESIGN', 'LAND_OFFER', 'INVEST', 'GENERAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST', 'SPAM');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('WEBSITE', 'ORGANIC_SEARCH', 'SOCIAL', 'ADS', 'REFERRAL', 'WHATSAPP', 'EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('NOTE', 'STATUS_CHANGE', 'ASSIGNMENT', 'CALL', 'WHATSAPP', 'EMAIL', 'MEETING', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AttachmentKind" AS ENUM ('LAND_PHOTO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "OwnershipStatus" AS ENUM ('SHM', 'SHGB', 'AJB', 'GIRIK', 'LETTER_C', 'OTHER');

-- CreateEnum
CREATE TYPE "ExpectedScheme" AS ENUM ('BAGI_HASIL', 'SEWA', 'JUAL', 'BELUM_TAHU');

-- CreateEnum
CREATE TYPE "StartTimeline" AS ENUM ('IMMEDIATE', 'M3_6', 'M6_12', 'OVER_12', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('UNDER_500M', 'M500_1B', 'B1_5', 'B5_20', 'ABOVE_20B');

-- CreateEnum
CREATE TYPE "RiskProfile" AS ENUM ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "InvestmentInstrument" AS ENUM ('EQUITY', 'PROFIT_SHARE', 'FIXED_RETURN', 'OPEN');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNED', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DeletionRequestStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "phone" TEXT,
    "whatsapp" TEXT,
    "city" TEXT,
    "company" TEXT,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_design" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "category" "DesignCategory" NOT NULL,
    "style" TEXT NOT NULL,
    "floors" INTEGER NOT NULL DEFAULT 1,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "bathrooms" INTEGER NOT NULL DEFAULT 0,
    "carports" INTEGER NOT NULL DEFAULT 0,
    "buildingAreaM2" INTEGER NOT NULL,
    "landAreaMinM2" INTEGER NOT NULL,
    "estimatedBuildCostMin" BIGINT,
    "estimatedBuildCostMax" BIGINT,
    "priceFrom" BIGINT,
    "status" "DesignStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "property_design_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_design_media" (
    "id" SERIAL NOT NULL,
    "designId" INTEGER NOT NULL,
    "kind" "MediaKind" NOT NULL DEFAULT 'IMAGE',
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_design_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_tag" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "design_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_tag_on_design" (
    "designId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "design_tag_on_design_pkey" PRIMARY KEY ("designId","tagId")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "LeadType" NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" "LeadPriority" NOT NULL DEFAULT 'NORMAL',
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneNormalized" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "message" TEXT,
    "designId" INTEGER,
    "source" "LeadSource" NOT NULL DEFAULT 'WEBSITE',
    "landingPath" TEXT,
    "referrerUrl" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "userId" TEXT,
    "assignedToId" TEXT,
    "estimatedValue" BIGINT,
    "lostReason" TEXT,
    "firstContactedAt" TIMESTAMP(3),
    "lastContactedAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "spamScore" INTEGER NOT NULL DEFAULT 0,
    "idempotencyKey" TEXT,
    "customerNote" TEXT,
    "customerNoteUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_submission" (
    "id" SERIAL NOT NULL,
    "leadId" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "areaM2" INTEGER NOT NULL,
    "frontageM" INTEGER,
    "ownershipStatus" "OwnershipStatus" NOT NULL,
    "certificateOnBehalf" TEXT,
    "zoning" TEXT,
    "currentUse" TEXT,
    "roadAccess" TEXT,
    "estimatedValue" BIGINT,
    "expectedScheme" "ExpectedScheme" NOT NULL,
    "startTimeline" "StartTimeline",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "land_submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_interest" (
    "id" SERIAL NOT NULL,
    "leadId" UUID NOT NULL,
    "budgetRange" "BudgetRange" NOT NULL,
    "preferredLocations" TEXT[],
    "horizonMonths" INTEGER,
    "riskProfile" "RiskProfile" NOT NULL DEFAULT 'UNKNOWN',
    "instrument" "InvestmentInstrument",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investment_interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activity" (
    "id" SERIAL NOT NULL,
    "leadId" UUID NOT NULL,
    "type" "ActivityType" NOT NULL,
    "body" TEXT,
    "meta" JSONB,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_attachment" (
    "id" SERIAL NOT NULL,
    "leadId" UUID NOT NULL,
    "kind" "AttachmentKind" NOT NULL DEFAULT 'LAND_PHOTO',
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedById" TEXT,

    CONSTRAINT "lead_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ONGOING',
    "yearStarted" INTEGER,
    "yearCompleted" INTEGER,
    "landAreaM2" INTEGER,
    "unitCount" INTEGER,
    "coverImageUrl" TEXT,
    "galleryUrls" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "readingMinutes" INTEGER,
    "tags" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'umum',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "projectName" TEXT,
    "quote" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_setting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_setting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ipHash" TEXT,
    "actorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "designId" INTEGER,
    "leadId" UUID,
    "sessionId" TEXT,
    "props" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funnel_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_deletion_request" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT,
    "status" "DeletionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handledAt" TIMESTAMP(3),
    "handledById" TEXT,
    "note" TEXT,

    CONSTRAINT "account_deletion_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "property_design_slug_key" ON "property_design"("slug");

-- CreateIndex
CREATE INDEX "property_design_status_publishedAt_idx" ON "property_design"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "property_design_category_style_idx" ON "property_design"("category", "style");

-- CreateIndex
CREATE INDEX "property_design_featured_status_idx" ON "property_design"("featured", "status");

-- CreateIndex
CREATE INDEX "property_design_deletedAt_idx" ON "property_design"("deletedAt");

-- CreateIndex
CREATE INDEX "property_design_media_designId_sortOrder_idx" ON "property_design_media"("designId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "design_tag_slug_key" ON "design_tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "design_tag_name_key" ON "design_tag"("name");

-- CreateIndex
CREATE INDEX "design_tag_on_design_tagId_idx" ON "design_tag_on_design"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "lead_reference_key" ON "lead"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "lead_idempotencyKey_key" ON "lead"("idempotencyKey");

-- CreateIndex
CREATE INDEX "lead_status_createdAt_idx" ON "lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "lead_type_status_idx" ON "lead"("type", "status");

-- CreateIndex
CREATE INDEX "lead_assignedToId_status_idx" ON "lead"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "lead_phoneNormalized_idx" ON "lead"("phoneNormalized");

-- CreateIndex
CREATE INDEX "lead_createdAt_idx" ON "lead"("createdAt");

-- CreateIndex
CREATE INDEX "lead_designId_idx" ON "lead"("designId");

-- CreateIndex
CREATE INDEX "lead_deletedAt_idx" ON "lead"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "land_submission_leadId_key" ON "land_submission"("leadId");

-- CreateIndex
CREATE INDEX "land_submission_province_city_idx" ON "land_submission"("province", "city");

-- CreateIndex
CREATE UNIQUE INDEX "investment_interest_leadId_key" ON "investment_interest"("leadId");

-- CreateIndex
CREATE INDEX "lead_activity_leadId_createdAt_idx" ON "lead_activity"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "lead_activity_actorId_createdAt_idx" ON "lead_activity"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "lead_attachment_leadId_idx" ON "lead_attachment"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "project_slug_key" ON "project"("slug");

-- CreateIndex
CREATE INDEX "project_isPublished_sortOrder_idx" ON "project"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "project_status_yearCompleted_idx" ON "project"("status", "yearCompleted");

-- CreateIndex
CREATE INDEX "project_deletedAt_idx" ON "project"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "article_slug_key" ON "article"("slug");

-- CreateIndex
CREATE INDEX "article_status_publishedAt_idx" ON "article"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "article_deletedAt_idx" ON "article"("deletedAt");

-- CreateIndex
CREATE INDEX "faq_category_sortOrder_idx" ON "faq"("category", "sortOrder");

-- CreateIndex
CREATE INDEX "audit_log_entityType_entityId_idx" ON "audit_log"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_log_actorId_createdAt_idx" ON "audit_log"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "funnel_event_name_createdAt_idx" ON "funnel_event"("name", "createdAt");

-- CreateIndex
CREATE INDEX "funnel_event_designId_idx" ON "funnel_event"("designId");

-- CreateIndex
CREATE INDEX "funnel_event_leadId_idx" ON "funnel_event"("leadId");

-- CreateIndex
CREATE INDEX "account_deletion_request_userId_status_idx" ON "account_deletion_request"("userId", "status");

-- CreateIndex
CREATE INDEX "account_deletion_request_status_requestedAt_idx" ON "account_deletion_request"("status", "requestedAt");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_design_media" ADD CONSTRAINT "property_design_media_designId_fkey" FOREIGN KEY ("designId") REFERENCES "property_design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_tag_on_design" ADD CONSTRAINT "design_tag_on_design_designId_fkey" FOREIGN KEY ("designId") REFERENCES "property_design"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_tag_on_design" ADD CONSTRAINT "design_tag_on_design_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "design_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_designId_fkey" FOREIGN KEY ("designId") REFERENCES "property_design"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_submission" ADD CONSTRAINT "land_submission_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_interest" ADD CONSTRAINT "investment_interest_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activity" ADD CONSTRAINT "lead_activity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activity" ADD CONSTRAINT "lead_activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_attachment" ADD CONSTRAINT "lead_attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_attachment" ADD CONSTRAINT "lead_attachment_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_setting" ADD CONSTRAINT "site_setting_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_deletion_request" ADD CONSTRAINT "account_deletion_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_deletion_request" ADD CONSTRAINT "account_deletion_request_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "property_design" ADD COLUMN     "projectId" INTEGER;

-- CreateIndex
CREATE INDEX "property_design_projectId_idx" ON "property_design"("projectId");

-- AddForeignKey
ALTER TABLE "property_design" ADD CONSTRAINT "property_design_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

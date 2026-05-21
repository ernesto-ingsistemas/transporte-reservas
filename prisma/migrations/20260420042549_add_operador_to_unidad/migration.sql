-- AlterTable
ALTER TABLE "Unidad" ADD COLUMN     "operadorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Unidad" ADD CONSTRAINT "Unidad_operadorId_fkey" FOREIGN KEY ("operadorId") REFERENCES "Operador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `nombre` on the `Unidad` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[placa]` on the table `Unidad` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `numero` to the `Unidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placa` to the `Unidad` table without a default value. This is not possible if the table is not empty.
  - Made the column `empresaId` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_empresaId_fkey";

-- AlterTable
ALTER TABLE "Unidad" DROP COLUMN "nombre",
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "placa" TEXT NOT NULL,
ADD COLUMN     "usuarioId" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "empresaId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Unidad_placa_key" ON "Unidad"("placa");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidad" ADD CONSTRAINT "Unidad_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

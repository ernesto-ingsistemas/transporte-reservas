-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'activa',
ADD COLUMN     "fechaVencimiento" TIMESTAMP(3);

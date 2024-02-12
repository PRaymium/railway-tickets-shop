/*
  Warnings:

  - You are about to drop the `_train_to_carriage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_train_to_carriage";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "train_to_carriage" (
    "train_id" INTEGER NOT NULL,
    "carriage_id" INTEGER NOT NULL,
    "carriage_number" INTEGER NOT NULL,

    PRIMARY KEY ("train_id", "carriage_id"),
    CONSTRAINT "train_to_carriage_train_id_fkey" FOREIGN KEY ("train_id") REFERENCES "train" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "train_to_carriage_carriage_id_fkey" FOREIGN KEY ("carriage_id") REFERENCES "carriage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

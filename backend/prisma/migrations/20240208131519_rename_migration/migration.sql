/*
  Warnings:

  - You are about to drop the column `num` on the `seat` table. All the data in the column will be lost.
  - Added the required column `number` to the `seat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_seat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "carriage_id" INTEGER NOT NULL,
    CONSTRAINT "seat_carriage_id_fkey" FOREIGN KEY ("carriage_id") REFERENCES "carriage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_seat" ("carriage_id", "id", "position", "number") SELECT "carriage_id", "id", "position", "num" FROM "seat";
DROP TABLE "seat";
ALTER TABLE "new_seat" RENAME TO "seat";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

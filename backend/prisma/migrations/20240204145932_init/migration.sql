-- CreateTable
CREATE TABLE "trip" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "departure_date" DATETIME NOT NULL,
    "destination_date" DATETIME NOT NULL,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "departure_city_id" INTEGER NOT NULL,
    "destination_city_id" INTEGER NOT NULL,
    "train_id" INTEGER NOT NULL,
    CONSTRAINT "trip_departure_city_id_fkey" FOREIGN KEY ("departure_city_id") REFERENCES "city" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trip_destination_city_id_fkey" FOREIGN KEY ("destination_city_id") REFERENCES "city" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "trip_train_id_fkey" FOREIGN KEY ("train_id") REFERENCES "train" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "city" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "train" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locomotive_id" INTEGER NOT NULL,
    CONSTRAINT "train_locomotive_id_fkey" FOREIGN KEY ("locomotive_id") REFERENCES "locomotive" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "locomotive" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "carriage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL DEFAULT 1,
    "seats_count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "seat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "num" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "carriage_id" INTEGER NOT NULL,
    CONSTRAINT "seat_carriage_id_fkey" FOREIGN KEY ("carriage_id") REFERENCES "carriage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "seat_ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" INTEGER NOT NULL,
    "is_buyed" BOOLEAN NOT NULL DEFAULT false,
    "train_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,
    CONSTRAINT "seat_ticket_train_id_fkey" FOREIGN KEY ("train_id") REFERENCES "train" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "seat_ticket_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_train_to_carriage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_train_to_carriage_A_fkey" FOREIGN KEY ("A") REFERENCES "carriage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_train_to_carriage_B_fkey" FOREIGN KEY ("B") REFERENCES "train" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "trip_train_id_key" ON "trip"("train_id");

-- CreateIndex
CREATE UNIQUE INDEX "locomotive_name_key" ON "locomotive"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_train_to_carriage_AB_unique" ON "_train_to_carriage"("A", "B");

-- CreateIndex
CREATE INDEX "_train_to_carriage_B_index" ON "_train_to_carriage"("B");

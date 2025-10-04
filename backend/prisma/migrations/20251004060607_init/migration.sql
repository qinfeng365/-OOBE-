-- CreateTable
CREATE TABLE "oobe_pages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "oobe_pages_page_number_key" ON "oobe_pages"("page_number");

CREATE TABLE "url" (
	"id"	INTEGER NOT NULL,
	"originUrl"	TEXT NOT NULL,
	"hash"	TEXT NOT NULL,
	"shortUrl"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
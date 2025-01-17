-- CreateTable
CREATE TABLE "session" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(1024) NOT NULL,
    "lastAccess" TIMESTAMPTZ(3),
    "timesLoggedIn" INTEGER NOT NULL DEFAULT 0,
    "accountConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "typeId" SMALLINT NOT NULL,
    "statusId" SMALLINT NOT NULL,
    "rolId" SMALLINT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_type" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,

    CONSTRAINT "session_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_status" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,

    CONSTRAINT "session_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_rol" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(256),

    CONSTRAINT "session_rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(1024),
    "lastName" VARCHAR(1024),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(3),
    "sessionId" BIGINT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_admin" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(1024),
    "lastName" VARCHAR(1024),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(3),
    "sessionId" BIGINT NOT NULL,

    CONSTRAINT "user_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_email_key" ON "session"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessionId_key" ON "user"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_admin_sessionId_key" ON "user_admin"("sessionId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "session_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "session_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "session_rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_admin" ADD CONSTRAINT "user_admin_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

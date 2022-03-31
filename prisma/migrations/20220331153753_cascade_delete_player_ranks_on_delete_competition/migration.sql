-- DropForeignKey
ALTER TABLE "PlayerRank" DROP CONSTRAINT "PlayerRank_competitionId_fkey";

-- AddForeignKey
ALTER TABLE "PlayerRank" ADD CONSTRAINT "PlayerRank_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

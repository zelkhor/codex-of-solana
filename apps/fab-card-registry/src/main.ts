import 'dotenv/config';

import {
  CreateSetGroupUseCase,
  ImportArtistsUseCase,
  ImportClassesUseCase,
  ImportEditionsUseCase,
  ImportFoilingsUseCase,
  ImportFormatsUseCase,
  ImportHeroesUseCase,
  ImportKeywordsUseCase,
  ImportRaritiesUseCase,
  ImportSetReleasesUseCase,
  ImportSubtypesUseCase,
  ImportTalentsUseCase,
  ImportTreatmentsUseCase,
  ImportTypesUsecase,
  PrismaArtistRepository,
  PrismaClassRepository,
  PrismaEditionRepository,
  PrismaFoilingRepository,
  PrismaFormatRepository,
  PrismaHeroRepository,
  PrismaKeywordRepository,
  PrismaRarityRepository,
  PrismaSetGroupRepository,
  PrismaSetReleaseRepository,
  PrismaSubtypeRepository,
  PrismaTalentRepository,
  PrismaTransactionPerformer,
  PrismaTreatmentRepository,
  PrismaTypeRepository,
} from '@codex/core';
import { prisma } from '@codex/orm';

import { importHeroes } from './import-heroes';
import { importReferenceData } from './import-reference-data';
import { importSetReleases } from './import-set-releases';

const main = async () => {
  console.log('[fab-card-registry] sync starting…');

  // Repositories
  const classRepository = new PrismaClassRepository(prisma);
  const talentRepository = new PrismaTalentRepository(prisma);
  const typeRepository = new PrismaTypeRepository(prisma);
  const subtypeRepository = new PrismaSubtypeRepository(prisma);
  const keywordRepository = new PrismaKeywordRepository(prisma);
  const rarityRepository = new PrismaRarityRepository(prisma);
  const foilingRepository = new PrismaFoilingRepository(prisma);
  const treatmentRepository = new PrismaTreatmentRepository(prisma);
  const editionRepository = new PrismaEditionRepository(prisma);
  const formatRepository = new PrismaFormatRepository(prisma);
  const artistRepository = new PrismaArtistRepository(prisma);
  const heroRepository = new PrismaHeroRepository(prisma);
  const setGroupRepository = new PrismaSetGroupRepository(prisma);
  const setReleaseRepository = new PrismaSetReleaseRepository(prisma);

  // Use-cases
  const importClasses = new ImportClassesUseCase(classRepository);
  const importTalents = new ImportTalentsUseCase(talentRepository);
  const importTypes = new ImportTypesUsecase(typeRepository);
  const importSubtypes = new ImportSubtypesUseCase(subtypeRepository);
  const importKeywords = new ImportKeywordsUseCase(keywordRepository);
  const importRarities = new ImportRaritiesUseCase(rarityRepository);
  const importFoilings = new ImportFoilingsUseCase(foilingRepository);
  const importTreatments = new ImportTreatmentsUseCase(treatmentRepository);
  const importEditions = new ImportEditionsUseCase(editionRepository);
  const importFormats = new ImportFormatsUseCase(formatRepository);
  const importArtists = new ImportArtistsUseCase(artistRepository);
  const createSetGroup = new CreateSetGroupUseCase(setGroupRepository);
  const importSetReleasesUseCase = new ImportSetReleasesUseCase(setReleaseRepository);
  const transactionPerformer = new PrismaTransactionPerformer(prisma);
  const importHeroesUseCase = new ImportHeroesUseCase(heroRepository, transactionPerformer);

  try {
    await importReferenceData({
      importClasses,
      importTalents,
      importTypes,
      importSubtypes,
      importKeywords,
      importRarities,
      importFoilings,
      importTreatments,
      importEditions,
      importFormats,
      importArtists,
    });

    // Interactive phase: prompts only when the package has sets not yet in the DB.
    await importSetReleases({
      setGroupRepository,
      setReleaseRepository,
      createSetGroup,
      importSetReleasesUseCase,
    });

    // Interactive phase: prompts to match young↔adult forms for ambiguous hero groups.
    await importHeroes({ heroRepository, importHeroesUseCase });
  } finally {
    await prisma.$disconnect();
  }
};

void main();

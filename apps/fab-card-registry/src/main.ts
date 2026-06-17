import 'dotenv/config';

import {
  ArtistPrismaRepository,
  ClassPrismaRepository,
  CreateSetGroupUseCase,
  EditionPrismaRepository,
  FoilingPrismaRepository,
  FormatPrismaRepository,
  ImportArtistsUseCase,
  ImportClassesUseCase,
  ImportEditionsUseCase,
  ImportFoilingsUseCase,
  ImportFormatsUseCase,
  ImportKeywordsUseCase,
  ImportRaritiesUseCase,
  ImportSetReleasesUseCase,
  ImportSubtypesUseCase,
  ImportTalentsUseCase,
  ImportTreatmentsUseCase,
  ImportTypesUsecase,
  KeywordPrismaRepository,
  RarityPrismaRepository,
  SetGroupPrismaRepository,
  SetReleasePrismaRepository,
  SubtypePrismaRepository,
  TalentPrismaRepository,
  TreatmentPrismaRepository,
  TypePrismaRepository,
} from '@codex/core';
import { prisma } from '@codex/orm';

import { importReferenceData } from './import-reference-data';
import { importSetReleases } from './import-set-releases';

const main = async () => {
  console.log('[fab-card-registry] sync starting…');

  // Repositories
  const classRepository = new ClassPrismaRepository(prisma);
  const talentRepository = new TalentPrismaRepository(prisma);
  const typeRepository = new TypePrismaRepository(prisma);
  const subtypeRepository = new SubtypePrismaRepository(prisma);
  const keywordRepository = new KeywordPrismaRepository(prisma);
  const rarityRepository = new RarityPrismaRepository(prisma);
  const foilingRepository = new FoilingPrismaRepository(prisma);
  const treatmentRepository = new TreatmentPrismaRepository(prisma);
  const editionRepository = new EditionPrismaRepository(prisma);
  const formatRepository = new FormatPrismaRepository(prisma);
  const artistRepository = new ArtistPrismaRepository(prisma);
  const setGroupRepository = new SetGroupPrismaRepository(prisma);
  const setReleaseRepository = new SetReleasePrismaRepository(prisma);

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
  } finally {
    await prisma.$disconnect();
  }
};

void main();

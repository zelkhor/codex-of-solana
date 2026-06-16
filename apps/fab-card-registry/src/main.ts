import {
  Class,
  Foiling,
  Format,
  Keyword,
  Rarity,
  ReleaseEdition,
  Subtype,
  Talent,
  Treatment,
  Type,
} from '@flesh-and-blood/types';
import 'dotenv/config';

import {
  ClassPrismaRepository,
  EditionPrismaRepository,
  FoilingPrismaRepository,
  FormatPrismaRepository,
  ImportClassesUseCase,
  ImportEditionsUseCase,
  ImportFoilingsUseCase,
  ImportFormatsUseCase,
  ImportKeywordsUseCase,
  ImportRaritiesUseCase,
  ImportSubtypesUseCase,
  ImportTalentsUseCase,
  ImportTreatmentsUseCase,
  ImportTypesUsecase,
  KeywordPrismaRepository,
  RarityPrismaRepository,
  SubtypePrismaRepository,
  TalentPrismaRepository,
  TreatmentPrismaRepository,
  TypePrismaRepository,
} from '@codex/core';
import { prisma } from '@codex/orm';

const getClasses = (): string[] => Object.values(Class).filter((name) => name !== Class.NotClassed);
const getTalents = (): string[] => Object.values(Talent);
const getTypes = (): string[] => Object.values(Type);
const getSubtypes = (): string[] => Object.values(Subtype);
const getKeywords = (): string[] => Object.values(Keyword);
const getRarities = (): string[] => Object.values(Rarity);
// 'Regular' is our domain's base foiling — the package only defines the special foils.
const getFoilings = (): string[] => ['Regular', ...Object.values(Foiling)];
const getTreatments = (): string[] => Object.values(Treatment);
const getEditions = (): string[] => Object.values(ReleaseEdition);
const getFormats = (): string[] => Object.values(Format);

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

  // Values from package
  const names = getClasses();
  const talents = getTalents();
  const types = getTypes();
  const subtypes = getSubtypes();
  const keywords = getKeywords();
  const rarities = getRarities();
  const foilings = getFoilings();
  const treatments = getTreatments();
  const editions = getEditions();
  const formats = getFormats();

  try {
    const classResult = await importClasses.execute({ names });
    if (!classResult.ok) throw classResult.error;

    console.log(`[fab-card-registry] synced ${names.length} classes.`);

    const talentsResult = await importTalents.execute({ names: talents });
    if (!talentsResult.ok) throw talentsResult.error;

    console.log(`[fab-card-registry] synced ${talents.length} talents.`);

    const typesResult = await importTypes.execute({ names: types });
    if (!typesResult.ok) throw typesResult.error;

    console.log(`[fab-card-registry] synced ${types.length} types.`);

    const subtypesResult = await importSubtypes.execute({ names: subtypes });
    if (!subtypesResult.ok) throw subtypesResult.error;

    console.log(`[fab-card-registry] synced ${subtypes.length} subtypes.`);

    const keywordsResult = await importKeywords.execute({ names: keywords });
    if (!keywordsResult.ok) throw keywordsResult.error;

    console.log(`[fab-card-registry] synced ${keywords.length} keywords.`);

    const raritiesResult = await importRarities.execute({ names: rarities });
    if (!raritiesResult.ok) throw raritiesResult.error;

    console.log(`[fab-card-registry] synced ${rarities.length} rarities.`);

    const foilingsResult = await importFoilings.execute({ names: foilings });
    if (!foilingsResult.ok) throw foilingsResult.error;

    console.log(`[fab-card-registry] synced ${foilings.length} foilings.`);

    const treatmentsResult = await importTreatments.execute({ names: treatments });
    if (!treatmentsResult.ok) throw treatmentsResult.error;

    console.log(`[fab-card-registry] synced ${treatments.length} treatments.`);

    const editionsResult = await importEditions.execute({ names: editions });
    if (!editionsResult.ok) throw editionsResult.error;

    console.log(`[fab-card-registry] synced ${editions.length} editions.`);

    const formatsResult = await importFormats.execute({ names: formats });
    if (!formatsResult.ok) throw formatsResult.error;

    console.log(`[fab-card-registry] synced ${formats.length} formats.`);
  } finally {
    await prisma.$disconnect();
  }
};

void main();

import { cards as fabCards } from '@flesh-and-blood/cards';
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

import type {
  ImportArtistsUseCase,
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
} from '@codex/core';

export type ReferenceDataDependencies = {
  importClasses: ImportClassesUseCase;
  importTalents: ImportTalentsUseCase;
  importTypes: ImportTypesUsecase;
  importSubtypes: ImportSubtypesUseCase;
  importKeywords: ImportKeywordsUseCase;
  importRarities: ImportRaritiesUseCase;
  importFoilings: ImportFoilingsUseCase;
  importTreatments: ImportTreatmentsUseCase;
  importEditions: ImportEditionsUseCase;
  importFormats: ImportFormatsUseCase;
  importArtists: ImportArtistsUseCase;
};

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
// Artists aren't an enum — collect the distinct, non-empty names credited on card printings.
const getArtists = (): string[] =>
  [
    ...new Set(
      fabCards.flatMap((card) => card.printings.flatMap((printing) => printing.artists ?? [])),
    ),
  ].filter((name) => name.trim().length > 0);

export const importReferenceData = async (deps: ReferenceDataDependencies): Promise<void> => {
  const classes = getClasses();
  const classesResult = await deps.importClasses.execute({ names: classes });
  if (!classesResult.ok) throw classesResult.error;
  console.log(`[fab-card-registry] synced ${classes.length} classes.`);

  const talents = getTalents();
  const talentsResult = await deps.importTalents.execute({ names: talents });
  if (!talentsResult.ok) throw talentsResult.error;
  console.log(`[fab-card-registry] synced ${talents.length} talents.`);

  const types = getTypes();
  const typesResult = await deps.importTypes.execute({ names: types });
  if (!typesResult.ok) throw typesResult.error;
  console.log(`[fab-card-registry] synced ${types.length} types.`);

  const subtypes = getSubtypes();
  const subtypesResult = await deps.importSubtypes.execute({ names: subtypes });
  if (!subtypesResult.ok) throw subtypesResult.error;
  console.log(`[fab-card-registry] synced ${subtypes.length} subtypes.`);

  const keywords = getKeywords();
  const keywordsResult = await deps.importKeywords.execute({ names: keywords });
  if (!keywordsResult.ok) throw keywordsResult.error;
  console.log(`[fab-card-registry] synced ${keywords.length} keywords.`);

  const rarities = getRarities();
  const raritiesResult = await deps.importRarities.execute({ names: rarities });
  if (!raritiesResult.ok) throw raritiesResult.error;
  console.log(`[fab-card-registry] synced ${rarities.length} rarities.`);

  const foilings = getFoilings();
  const foilingsResult = await deps.importFoilings.execute({ names: foilings });
  if (!foilingsResult.ok) throw foilingsResult.error;
  console.log(`[fab-card-registry] synced ${foilings.length} foilings.`);

  const treatments = getTreatments();
  const treatmentsResult = await deps.importTreatments.execute({ names: treatments });
  if (!treatmentsResult.ok) throw treatmentsResult.error;
  console.log(`[fab-card-registry] synced ${treatments.length} treatments.`);

  const editions = getEditions();
  const editionsResult = await deps.importEditions.execute({ names: editions });
  if (!editionsResult.ok) throw editionsResult.error;
  console.log(`[fab-card-registry] synced ${editions.length} editions.`);

  const formats = getFormats();
  const formatsResult = await deps.importFormats.execute({ names: formats });
  if (!formatsResult.ok) throw formatsResult.error;
  console.log(`[fab-card-registry] synced ${formats.length} formats.`);

  const artists = getArtists();
  const artistsResult = await deps.importArtists.execute({ names: artists });
  if (!artistsResult.ok) throw artistsResult.error;
  console.log(`[fab-card-registry] synced ${artists.length} artists.`);
};

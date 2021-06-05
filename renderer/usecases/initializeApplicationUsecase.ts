import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { Columns, ColumnSpaces, ColumnSpace } from "../models/ColumnSpaces";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { DbFilesExclusiveTransaction } from "../modules/db";
import { DisplaySettings } from "../models/DisplaySettings";
import { GlobalSettings } from "../models/GlobalSettings";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";
import { GlobalSettingsRepositoryJson } from "../repositories/GlobalSettingsRepositoryJson";

export const initializeApplicationUsecase = async(): Promise<[ColumnSpaces, RelatedCells, DisplaySettings, GlobalSettings]> => {

  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const columnSpaces = await columnSpacesRepository.initialize()

  const relatedCellsRepository = new RelatedCellsRepositoryJson();
  const relatedCells = await relatedCellsRepository.initialize();

  const displaySettingsRepository = new DisplaySettingsRepositoryJson();
  const displaySettings = await displaySettingsRepository.initialize();

  const globalSettingsRepository = new GlobalSettingsRepositoryJson();
  const globalSettings = await globalSettingsRepository.initialize();

  return [columnSpaces, relatedCells, displaySettings, globalSettings];
}
export {
  usersTable,
  userLocaleEnum,
  userStatusEnum,
  type UserRow,
  type NewUserRow,
} from "@/infrastructure/database/schema/users.js";
export { citiesTable, type CityRow } from "@/infrastructure/database/schema/cities.js";
export {
  temperaturePreferenceEnum,
  onboardingStepEnum,
  preferenceSourceEnum,
  userProfilesTable,
  userStyleProfilesTable,
  userPreferencesTable,
  type UserProfileRow,
  type UserStyleProfileRow,
} from "@/infrastructure/database/schema/profiles.js";
export {
  clothingStatusEnum,
  mediaProcessingStatusEnum,
  clothingSourceTypeEnum,
  clothingSlotEnum,
  analysisStatusEnum,
  wardrobesTable,
  clothingCategoriesTable,
  clothingItemsTable,
  mediaAssetsTable,
  clothingImagesTable,
  clothingItemAnalysesTable,
  type WardrobeRow,
  type ClothingCategoryRow,
  type ClothingItemRow,
  type MediaAssetRow,
} from "@/infrastructure/database/schema/wardrobe.js";
export {
  weatherSnapshotsTable,
  type WeatherSnapshotRow,
} from "@/infrastructure/database/schema/weather.js";
export {
  outfitItemRoleEnum,
  recommendationTypeEnum,
  feedbackActionEnum,
  occasionsTable,
  outfitsTable,
  outfitItemsTable,
  outfitRecommendationsTable,
  outfitFeedbackTable,
  type OccasionRow,
  type OutfitRow,
  type OutfitRecommendationRow,
} from "@/infrastructure/database/schema/styling.js";
export {
  aiJobTypeEnum,
  aiJobStatusEnum,
  aiProcessingJobsTable,
  type AiProcessingJobRow,
} from "@/infrastructure/database/schema/ai.js";
export {
  collectionsTable,
  collectionOutfitsTable,
} from "@/infrastructure/database/schema/collections.js";

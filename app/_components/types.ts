export type TabKey =
  | "image-analysis"
  | "ingredient-recognition"
  | "image-creator";

export type TabItem = {
  key: TabKey;
  label: string;
};

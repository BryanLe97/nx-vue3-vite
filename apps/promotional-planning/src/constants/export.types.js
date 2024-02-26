export const PROMOTION_LIST = 1;
export const PROMOTION_ANALYSIS = 2;
export const DEMANTRA = 3;
export const PRICE_VOLUME_HISTORY = 4;

export const UPLOAD_TYPE = [
  {
    type: 1,
    name: "Product",
    url: "/promotion-planning/products/import",
    templateType: "csv",
  },
  {
    type: 2,
    name: "Promotion List",
    url: "/promotion-planning/promo-entries/upload",
    templateType: "csv",
  },
  {
    type: 3,
    name: "Sales Plan",
    url: "/promotion-planning/promo-entries/upload-detail",
    templateType: "csv",
  },
  {
    type: 4,
    name: "Price Volume History",
    url: "/promotion-planning/promo-entries/upload",
    templateType: "xlsx",
  },
  {
    type: 5,
    name: "POT",
    url: "/promotion-planning/promo-entries/upload-pot",
    templateType: "xlsx",
  },
  {
    type: 6,
    name: "Mass Publish",
    url: "/promotion-planning/promo-entries/upload-publishpot",
    templateType: "csv",
  },
  {
    type: 7,
    name: "Mass Acceptance",
    url: "/promotion-planning/promo-entries/upload-mass-acceptance",
    templateType: "csv",
  },
  {
    type: 8,
    name: "Mass Deletion",
    url: "/promotion-planning/promo-entries/upload-mass-deletion",
    templateType: "csv",
  },
];

export const EXPORT_TYPE_NAMES = {
  [PROMOTION_LIST]: "Promotion List",
  [PROMOTION_ANALYSIS]: "Promotion Analysis",
  [DEMANTRA]: "Demantra",
  [PRICE_VOLUME_HISTORY]: "Price Volume History",
};

export const EXPORT_TYPE_DISABLED = {
  [PROMOTION_LIST]: false,
  [PROMOTION_ANALYSIS]: false,
  [DEMANTRA]: false,
  [PRICE_VOLUME_HISTORY]: true,
};

export const EXPORT_TYPES = [
  {
    value: PROMOTION_LIST,
    name: EXPORT_TYPE_NAMES[PROMOTION_LIST],
    disabled: EXPORT_TYPE_DISABLED[PROMOTION_LIST],
  },
  {
    value: PROMOTION_ANALYSIS,
    name: EXPORT_TYPE_NAMES[PROMOTION_ANALYSIS],
    disabled: EXPORT_TYPE_DISABLED[PROMOTION_ANALYSIS],
  },
  {
    value: DEMANTRA,
    name: EXPORT_TYPE_NAMES[DEMANTRA],
    disabled: EXPORT_TYPE_DISABLED[DEMANTRA],
  },
  {
    value: PRICE_VOLUME_HISTORY,
    name: EXPORT_TYPE_NAMES[PRICE_VOLUME_HISTORY],
    disabled: EXPORT_TYPE_DISABLED[PRICE_VOLUME_HISTORY],
  },
];

export const CSV_MIME_TYPES = [
  "", // This only happen on Jane's laptop. No idea why. 🤣
  "application/csv",
  "application/vnd.ms-excel",
  "application/x-csv",
  "text/comma-separated-values",
  "text/csv",
  "text/plain",
  "text/tab-separated-values",
  "text/x-comma-separated-values",
  "text/x-csv",
];

export const EXCEL_MIME_TYPES = [
  "",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

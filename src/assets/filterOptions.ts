import { FilterOption } from "../types";

export const DEFAULT_FILTER_OPTIONS: {
  [key: string]: FilterOption;
} = {
  review_status: {
      key: 'review_status',
      displayName: "Review Status",   
      type: "checkbox",
      operator: 'equals',
      options: [
          { name: "reviewed", checked: true, value: "reviewed" },
          { name: "unreviewed", checked: true, value: "unreviewed" },
          { name: "incomplete", checked: true, value: "incomplete" },
          { name: "defective", checked: true, value: "defective" },
      ],
      selectedOptions: ["reviewed", "unreviewed", "incomplete", "defective"]
  },
  name: {
    key: "name",
    displayName: "Record Name",
    type: "string",
    operator: 'equals',
    value: ''
  },
  dateCreated: {
    key: "dateCreated",
    displayName: "Date Uploaded",
    type: "date",
    operator: 'is',
    value: ''
  }
}

export const TABLE_ATTRIBUTES = {
  record_group: {
      displayNames: ["Record Name", "Date Uploaded", "API Number", "Mean Confidence", "Lowest Confidence", "Notes", "Digitization Status", "Review Status"],
      keyNames: ["name", "dateCreated", "API_NUMBER", "confidence_median", "confidence_lowest", "notes", "status", "review_status"],
  },
  project: {
    displayNames: ["Record Name", "Date Uploaded", "API Number", "Notes", "Review Status"],
    keyNames: ["name", "dateCreated", "API_NUMBER", "notes", "review_status"],
  },
}
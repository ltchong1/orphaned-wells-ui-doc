export const FILTER_OPTIONS: {
  [key: string]: {
      key: string;
      displayName: string;
      type: string;
      operator: string;
      options?: { name: string; checked: boolean }[];
      selectedOptions?: string[];
      value?: string;
  };
} = {
  review_status: {
      key: 'review_status',
      displayName: "Review Status",   
      type: "checkbox",
      operator: 'equals',
      options: [
          { name: "reviewed", checked: true },
          { name: "unreviewed", checked: true },
          { name: "incomplete", checked: true },
          { name: "defective", checked: true },
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
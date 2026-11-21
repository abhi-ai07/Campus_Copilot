
export default {
  name: "faq",
  title: "Frequently Asked Questions",
  type: "document",

  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "ERP",
          "Academic",
          "Examination",
          "Scholarship",
          "Library",
          "Admission",
          "General",
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "keywords",
      title: "Search Keywords",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "isPublished",
      title: "Publish FAQ",
      type: "boolean",
      initialValue: false,
    },
  ],

  preview: {
    select: {
      title: "question",
      subtitle: "category",
    },
  },
};

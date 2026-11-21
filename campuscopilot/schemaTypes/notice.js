
export default {
  name: "notice",
  title: "College Notices",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Notice Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Academic",
          "Examination",
          "Events",
          "Holiday",
          "Placement",
          "General",
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "priority",
      title: "Priority",
      type: "string",
      options: {
        list: ["Low", "Medium", "High"],
      },
      initialValue: "Medium",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    },
    {
      name: "attachment",
      title: "Attachment",
      type: "file",
      options: {
        accept: ".pdf,.doc,.docx",
      },
    },
    {
      name: "isPublished",
      title: "Publish Notice",
      type: "boolean",
      initialValue: false,
    },
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
  },
};

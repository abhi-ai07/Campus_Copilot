
export default {
  name: "collegeDocument",
  title: "College Documents",
  type: "document",

  fields: [
    {
      name: "title",
      title: "Document Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "category",
      title: "Document Category",
      type: "string",
      options: {
        list: [
          "Academic",
          "Examination",
          "Admission",
          "Scholarship",
          "Library",
          "ERP",
          "General",
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "documentFile",
      title: "Upload Document",
      type: "file",
      options: {
        accept: ".pdf,.doc,.docx",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "uploadedAt",
      title: "Upload Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "isPublished",
      title: "Publish Document",
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

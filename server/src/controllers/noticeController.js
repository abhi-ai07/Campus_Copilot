import sanityClient from "../config/sanityClient.js";

// Get all published notices from Sanity
export const getNotices = async (req, res) => {
  try {
    const notices = await sanityClient.fetch(`
      *[_type == "notice" && isPublished == true]
      | order(publishedAt desc) {
        _id,
        title,
        description,
        category,
        priority,
        publishedAt,
        "attachmentUrl": attachment.asset->url
      }
    `);

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    console.error("Sanity Notice Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
      error: error.message,
    });
  }
};

// Get single notice by Sanity ID
export const getNoticeById = async (req, res) => {
  try {
    const notice = await sanityClient.fetch(
      `*[_type == "notice" && _id == $id && isPublished == true][0] {
        _id,
        title,
        description,
        category,
        priority,
        publishedAt,
        "attachmentUrl": attachment.asset->url
      }`,
      { id: req.params.id },
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error("Sanity Notice Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notice",
      error: error.message,
    });
  }
};

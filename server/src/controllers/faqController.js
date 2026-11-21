import sanityClient from "../config/sanityClient.js";

// Get all published FAQs from Sanity
export const getFAQs = async (req, res) => {
  try {
    const faqs = await sanityClient.fetch(`
      *[_type == "faq" && isPublished == true]
      | order(_createdAt desc) {
        _id,
        question,
        answer,
        category,
        keywords
      }
    `);

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    console.error("Sanity FAQ Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message,
    });
  }
};

// Get single FAQ by Sanity ID
export const getFAQById = async (req, res) => {
  try {
    const faq = await sanityClient.fetch(
      `*[_type == "faq" && _id == $id && isPublished == true][0] {
        _id,
        question,
        answer,
        category,
        keywords
      }`,
      { id: req.params.id },
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Sanity FAQ Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ",
      error: error.message,
    });
  }
};

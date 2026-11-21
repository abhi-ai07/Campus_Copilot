import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "um5j4om9",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

export default sanityClient;

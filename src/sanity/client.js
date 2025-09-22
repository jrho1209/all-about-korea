import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,      // Sanity 관리 페이지에서 확인
  dataset: process.env.SANITY_DATASET,           // 예: "production"
  apiVersion: "2023-01-01",          // 또는 최신 날짜
  useCdn: false,
});
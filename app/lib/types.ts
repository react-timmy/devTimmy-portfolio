export type ProjectStatus   = "draft" | "published" | "archived";
export type ProjectCategory =
  | "mobile"
  | "web"
  | "ai-tool"
  | "client-work"
  | "community"
  | "experiment";

export interface Project {
  id:               string;
  slug:             string;
  title:            string;
  subtitle:         string;
  summary:          string;
  caseStudy?:       string;
  category:         ProjectCategory;
  status:           ProjectStatus;
  featured:         boolean;
  priority:         number;
  tags:             string[];
  techStack:        string[];
  role:             string;
  year:             number;
  coverImageUrl:    string;
  galleryImageUrls: string[];
  liveUrl:          string;
  githubUrl:        string;
  demoUrl?:         string;
  xPostUrl?:        string;
}

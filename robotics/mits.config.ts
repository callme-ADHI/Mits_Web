export type OrgType = "club" | "department";

export interface MitsConfig {
  organizationName: string;
  organizationType: OrgType;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

const config: MitsConfig = {
  organizationName: "Robotics Club",
  organizationType: "club",
  slug: "robotics",
  logoUrl: "",
  primaryColor: "#E10600",
  secondaryColor: "#111111",
};

export default config;

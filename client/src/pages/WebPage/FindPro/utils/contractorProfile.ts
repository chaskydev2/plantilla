import type {
  AcademicTraining,
  AddressInfo,
  ContractorFullInfo,
  ContractorUser,
  ContractInfo,
  Maybe,
  NearbyContractorCard,
  TimestampInfo,
  WorkExperience,
  WorkReference,
  TechnicalSkill,
} from "@/types/contractor";

export const DEFAULT_AVATAR = "/default-avatar.png";

export function toNumber(value: unknown): number | undefined {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

export function buildFullAddress(address?: Maybe<AddressInfo>): string {
  if (!address) return "-";
  if (address.full_address) return address.full_address;
  const parts = [
    address.address_line1,
    address.address_line2,
    address.city,
    address.state_code,
    address.country_code,
    address.preferred_zip,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
}

export function collectUniqueNames(items?: Maybe<Array<{ id?: number; slug?: string; name?: string }>>): string[] {
  if (!items) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  items.forEach((item) => {
    if (!item) return;
    const label = item.name || item.slug;
    if (!label) return;
    const key = `${item.id ?? label}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push(label);
  });
  return result;
}

export function extractList(payload: unknown): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const dataField = (payload as any).data;
  if (!dataField) return [];
  if (Array.isArray(dataField)) return dataField;
  if (dataField && typeof dataField === "object") return extractList(dataField);
  return [];
}

export function mapNearbyContractor(raw: any): NearbyContractorCard | null {
  if (!raw) return null;
  const candidateId = raw.user_id ?? raw.id ?? raw.user?.id;
  if (!candidateId) return null;
  const rating = toNumber(raw.company_info?.average_rating ?? raw.average_rating ?? raw.rating);
  const professions = collectUniqueNames(raw.professions);
  return {
    id: String(candidateId),
    name: raw.user?.name || raw.name || raw.company_info?.company_name || "Contractor",
    avatar: raw.avatar || raw.user?.avatar || null,
    rating: rating && rating > 0 ? rating : undefined,
    serviceArea: raw.company_info?.service_area || raw.address?.city || raw.city,
    distanceKm: toNumber(raw.location?.distance_km ?? raw.distance_km ?? raw.distance),
    professions: professions.length ? professions : undefined,
  };
}

export function getDisplayName(contractor: ContractorFullInfo): string {
  const user = contractor.user;
  const merged = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  return contractor.name || user?.name || merged || contractor.company_info?.company_name || "Contractor";
}

export function getAvatar(contractor: ContractorFullInfo): string {
  return contractor.avatar || contractor.user?.avatar || DEFAULT_AVATAR;
}

export function getAvatarInitials(name?: string | null): string {
  if (!name) return "C";
  const cleaned = name.trim();
  if (!cleaned) return "C";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (!parts.length) return "C";
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  const initials = `${first}${last}`.trim();
  if (initials) return initials.toUpperCase();
  return cleaned.slice(0, 2).toUpperCase();
}

export function getRatingValue(contractor: ContractorFullInfo): number {
  const rating = toNumber(contractor.company_info?.average_rating ?? contractor.rating);
  if (!rating || rating < 0) return 0;
  if (rating > 5) return 5;
  return rating;
}

export interface ContractorProfileViewModel {
  displayName: string;
  ratingValue: number;
  serviceArea: string;
  professionNames: string[];
  tagNames: string[];
  fullAddress: string;
  mobileNumber?: string;
  phoneNumber?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  contractInfo?: ContractInfo;
  timestamps?: TimestampInfo;
  academicTrainings: AcademicTraining[];
  workExperiences: WorkExperience[];
  technicalSkills: TechnicalSkill[];
  workReferences: WorkReference[];
  cvUrl?: string | null;
  user?: ContractorUser;
}

export function createContractorProfileViewModel(contractor: ContractorFullInfo): ContractorProfileViewModel {
  const user = contractor.user;
  const professionNames = Array.from(
    new Set([
      ...collectUniqueNames(contractor.professions),
      ...collectUniqueNames(user?.professions),
    ]),
  );
  console.log('Professions:', professionNames);
  const tagNames = collectUniqueNames(contractor.tags);
  const contact = contractor.contact;

  return {
    displayName: getDisplayName(contractor),
    ratingValue: getRatingValue(contractor),
    serviceArea: contractor.company_info?.service_area || contractor.address?.city || "Location not specified",
    professionNames,
    tagNames,
    fullAddress: buildFullAddress(contractor.address),
    mobileNumber: contact?.mobile_number || user?.mobile_number,
    phoneNumber: contact?.phone_number || user?.phone_number,
    linkedinUrl: contact?.linkedin_url,
    portfolioUrl: contact?.portfolio_url,
    contractInfo: contractor.contract,
    timestamps: contractor.timestamps,
    academicTrainings: user?.academic_trainings || [],
    workExperiences: user?.work_experiences || [],
    technicalSkills: user?.technical_skills || [],
    workReferences: user?.work_references || [],
    cvUrl: contractor.cv_url || contractor.cvUrl,
    user,
  };
}

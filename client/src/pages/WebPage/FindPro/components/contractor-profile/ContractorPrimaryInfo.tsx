import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Compass,
  Download,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Briefcase,
  BriefcaseBusiness,
  Tags,
  UserCheck,
  Wrench,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import type { ContractorFullInfo } from "@/types/contractor";
import { formatDate, getAvatar, getAvatarInitials } from "@/pages/WebPage/FindPro/utils/contractorProfile";
import type { ContractorProfileViewModel } from "@/pages/WebPage/FindPro/utils/contractorProfile";

interface ContractorPrimaryInfoProps {
  contractor: ContractorFullInfo;
  profile: ContractorProfileViewModel;
}

export function ContractorPrimaryInfo({ contractor, profile }: ContractorPrimaryInfoProps) {
  const user = profile.user;
  const ratingValue = profile.ratingValue;
  const contractInfo = profile.contractInfo;
  const timestamps = profile.timestamps;
  const cvUrl = profile.cvUrl;

  const ratingPercentage = Math.min(100, Math.max(0, (ratingValue / 5) * 100));
  const contactActions = [
    profile.mobileNumber && { label: "Call mobile", value: `tel:${profile.mobileNumber}`, icon: Phone },
    profile.phoneNumber && { label: "Call office", value: `tel:${profile.phoneNumber}`, icon: Phone },
    user?.email && { label: "Email", value: `mailto:${user.email}`, icon: Mail },
    profile.linkedinUrl && { label: "LinkedIn", value: profile.linkedinUrl, icon: Globe },
    profile.portfolioUrl && { label: "Portfolio", value: profile.portfolioUrl, icon: Globe },
  ].filter(Boolean) as Array<{ label: string; value: string; icon: LucideIcon }>;
  const hasAvatarImage = Boolean(contractor.avatar || contractor.user?.avatar);
  const avatarInitials = getAvatarInitials(profile.displayName);
  const memberSince = contractInfo?.approval_date ? formatDate(contractInfo.approval_date) : null;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-[#1E1E17]/12 bg-white shadow-[0_18px_48px_rgba(30,30,23,0.12)]">
        <div className="relative isolate overflow-hidden rounded-3xl px-6 py-7 sm:px-8">
          <div className="absolute inset-0 rounded-3xl bg-[#1E1E17]" aria-hidden />
          <div className="absolute inset-x-0 top-0 h-1 bg-[#F5D238]" aria-hidden />
          <div className="absolute -left-8 top-10 hidden h-20 w-20 rounded-full border border-[#F5D238]/20 bg-[#F5D238]/10 sm:block" aria-hidden />
          <div className="absolute -right-12 bottom-6 hidden h-24 w-24 rounded-full border border-[#F5D238]/15 opacity-60 sm:block" aria-hidden />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex items-center gap-5">
              <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full border-4 border-[#F5D238]/80 bg-white/95 shadow-[0_12px_20px_rgba(0,0,0,0.35)]">
                {hasAvatarImage ? (
                  <img
                    src={getAvatar(contractor)}
                    alt={profile.displayName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-black uppercase text-[#1E1E17]">
                    {avatarInitials}
                  </span>
                )}
                <span className="absolute -bottom-2 right-2 rounded-full bg-[#F5D238] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#1E1E17] shadow-sm">
                  Pro
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                    Contractor
                  </span>
                  {contractor.elite && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#F5D238]">
                      <ShieldCheck className="h-4 w-4" /> Elite Contractor
                    </span>
                  )}
                  {user?.verification && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#F5D238]/35 bg-[#F5D238]/15 px-3 py-1 text-[11px] font-semibold text-white">
                      <BadgeCheck className="h-4 w-4" /> Verified Identity
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{profile.displayName}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium text-white/70">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#F5D238]" />
                      {profile.serviceArea}
                    </span>
                    {user?.registration_code && (
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.28em] text-white/70">
                        Reg {user.registration_code}
                      </span>
                    )}
                    {memberSince && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70">
                        <Clock3 className="h-3.5 w-3.5 text-[#F5D238]" /> Active since {memberSince}
                      </span>
                    )}
                  </div>
                </div>

                {ratingValue > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm font-semibold text-white">
                      <div className="flex items-center gap-1 text-[#F5D238]">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star key={index} className={`h-4 w-4 ${index < Math.round(ratingValue) ? "fill-current" : "opacity-30"}`} />
                        ))}
                      </div>
                      <span>{ratingValue.toFixed(2)} global score</span>
                      {contractor.reviews_count !== undefined && (
                        <span className="text-xs font-medium text-white/60">{contractor.reviews_count} reviews</span>
                      )}
                    </div>
                    <div className="relative h-1.5 w-56 overflow-hidden rounded-full bg-white/15">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-[#F5D238]" style={{ width: `${ratingPercentage}%` }} />
                    </div>
                  </div>
                )}

                {profile.professionNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-white/75">
                    {profile.professionNames.slice(0, 4).map((name) => (
                      <span key={name} className="rounded-full border border-white/20 bg-white/10 px-3 py-1">
                        {name}
                      </span>
                    ))}
                    {profile.professionNames.length > 4 && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        +{profile.professionNames.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>



            <div className="flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 text-white shadow-inner sm:max-w-xs sm:self-stretch">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">Status</span>
                <p className="flex items-center gap-2 text-base font-semibold text-white">
                  <CheckCircle2 className="h-5 w-5 text-[#F5D238]" />
                  {contractInfo?.status_label || contractInfo?.contract_status || "Onboarding"}
                </p>
                {contractInfo?.approval_date && (
                  <span className="flex items-center gap-2 text-xs text-white/60">
                    <Clock3 className="h-3.5 w-3.5" /> Active since {formatDate(contractInfo.approval_date)}
                  </span>
                )}
              </div>

              <div className="grid gap-3 text-sm">
                {contactActions.slice(0, 3).map((action) => {
                  const Icon = action.icon;
                  const isExternal = /^https?:/i.test(action.value);
                  return (
                    <a
                      key={action.label}
                      href={action.value}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-[#F5D238]/60 hover:bg-[#F5D238]/10"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {action.label}
                      </span>
                    </a>
                  );
                })}
              </div>

              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-[#1E1E17] shadow-sm transition hover:bg-white/90"
                >
                  <Download className="h-4 w-4" /> Download CV
                </a>
              )}
            </div>
          </div>
        </div>

        {contractor.bio && (
          <div className="space-y-4 bg-white px-6 pb-6 pt-5">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1E1E17]/55">Description</span>
            <p className="rounded-3xl border border-[#1E1E17]/8 bg-[#0B0B0B] px-5 py-4 text-sm leading-relaxed text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {contractor.bio}
            </p>
          </div>
        )}
      </div>

      {contractor.company_info && (
        <div className="rounded-3xl border border-black/10 bg-[#090909] p-6 shadow-sm text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Building2 className="h-5 w-5 text-white" /> Company details
          </div>
          <div className="mt-4 grid gap-3 text-sm text-white/75 sm:grid-cols-2">
            <span>
              <strong className="text-white">Company:</strong> {contractor.company_info.company_name || "-"}
            </span>
            <span>
              <strong className="text-white">License:</strong> {contractor.company_info.license_number || "-"}
            </span>
            <span>
              <strong className="text-white">Insured:</strong> {contractor.company_info.is_insured ? "Yes" : "No"}
            </span>
            <span>
              <strong className="text-white">Service area:</strong> {contractor.company_info.service_area || "-"}
            </span>
            <span>
              <strong className="text-white">Average rating:</strong> {contractor.company_info.average_rating ?? "-"}
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-[#1E1E17]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-[#1E1E17]">
              <Phone className="h-4 w-4 text-[#1E1E17]" /> Direct Contact
            </h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#1E1E17]/40">
              Response time: fast
            </span>
          </div>
          <div className="mt-5 space-y-3 text-sm text-black/75">
            {profile.mobileNumber && (
              <a href={`tel:${profile.mobileNumber}`} className="flex items-center gap-2 rounded-2xl border border-[#F5D238]/15 bg-[#F5D238]/10 px-3 py-2 font-semibold text-[#1E1E17] transition hover:border-[#F5D238]/45">
                <Phone className="h-4 w-4 text-[#F5D238]" /> {profile.mobileNumber}
              </a>
            )}
            {profile.phoneNumber && (
              <a href={`tel:${profile.phoneNumber}`} className="flex items-center gap-2 rounded-2xl border border-[#1E1E17]/10 bg-[#F5D238]/5 px-3 py-2 font-semibold text-[#1E1E17] transition hover:border-[#F5D238]/45">
                <Phone className="h-4 w-4 text-[#F5D238]" /> {profile.phoneNumber}
              </a>
            )}
            {user?.email && (
              <a href={`mailto:${user.email}`} className="flex items-center gap-2 rounded-2xl border border-[#1E1E17]/10 bg-[#0B0B0B] px-3 py-2 font-semibold text-white transition hover:border-[#F5D238]/45">
                <Mail className="h-4 w-4 text-[#F5D238]" /> {user.email}
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#1E1E17]/15 bg-white px-3 py-2 font-semibold text-[#1E1E17] underline-offset-4 transition hover:border-[#F5D238]/45 hover:underline"
              >
                <Globe className="h-4 w-4 text-[#1E1E17]" /> LinkedIn
              </a>
            )}
            {profile.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-[#1E1E17]/15 bg-white px-3 py-2 font-semibold text-[#1E1E17] underline-offset-4 transition hover:border-[#F5D238]/45 hover:underline"
              >
                <Globe className="h-4 w-4 text-[#1E1E17]" /> Portfolio
              </a>
            )}
            {!profile.mobileNumber &&
              !profile.phoneNumber &&
              !user?.email &&
              !profile.linkedinUrl &&
              !profile.portfolioUrl && <span>No contact data available.</span>}
          </div>
        </div>

        <div className="rounded-3xl border border-[#1E1E17]/10 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-[#1E1E17]">
            <Compass className="h-4 w-4 text-[#1E1E17]" /> Location & Coverage
          </h3>
          <div className="mt-4 space-y-3 text-sm text-black/75">
            <div className="flex items-center gap-2 rounded-2xl border border-[#F5D238]/15 bg-[#F5D238]/10 px-3 py-2">
              <MapPin className="h-4 w-4 text-[#F5D238]" />
              <span>{profile.fullAddress}</span>
            </div>
            {contractor.location?.distance_km && (
              <div className="flex items-center gap-2 rounded-2xl border border-[#1E1E17]/10 bg-[#0B0B0B] px-3 py-2 text-white">
                <Compass className="h-4 w-4 text-[#F5D238]" />
                <span>{Number(contractor.location.distance_km).toFixed(2)} km reference</span>
              </div>
            )}
            {contractor.professional && (
              <div className="rounded-2xl border border-black/10 bg-[#0B0B0B] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                <Briefcase className="mr-2 inline h-4 w-4 text-white" /> Driving license: {contractor.professional.has_driving_license ? "Yes" : "No"}
                {contractor.professional.driving_license_category && (
                  <span className="ml-2 normal-case text-white/70">
                    Category: {contractor.professional.driving_license_category}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {profile.professionNames.length > 0 && (
        <div className="rounded-3xl border border-[#1E1E17]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-black">
            <Briefcase className="h-5 w-5 text-black" /> Professions
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.professionNames.map((name) => (
              <span key={name} className="rounded-full border border-black px-3 py-1 text-xs font-semibold text-white bg-black">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.tagNames.length > 0 && (
        <div className="rounded-3xl border border-[#1E1E17]/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-black">
            <Tags className="h-5 w-5 text-black" /> Tags
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.tagNames.map((name) => (
              <span
                key={name}
                className="rounded-full border border-black px-3 py-1 text-xs font-semibold text-white bg-black shadow-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {!contractor.bio && (
        <div className="rounded-3xl border border-black/10 bg-[#090909] px-6 py-4 text-sm text-white/75">
          No bio available.
        </div>
      )}

      {contractInfo && (
        <div className="rounded-3xl border border-black/10 bg-[#090909] p-6 shadow-sm text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-5 w-5 text-white" /> Contract status
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-white px-3 py-1 text-[#1E1E17]">
              {contractInfo.status_label || contractInfo.contract_status || "Unknown"}
            </span>
            {contractInfo.is_approved && (
              <span className="rounded-full bg-[#D8F5C2] px-3 py-1 text-[#1F5E2E]">Approved</span>
            )}
            {contractInfo.is_pending && (
              <span className="rounded-full bg-[#FFF0C2] px-3 py-1 text-[#735D07]">Pending</span>
            )}
            {contractInfo.is_rejected && (
              <span className="rounded-full bg-[#FDD8D3] px-3 py-1 text-[#7B1D1D]">Rejected</span>
            )}
            {contractInfo.is_suspended && (
              <span className="rounded-full bg-[#ECE8DE] px-3 py-1 text-[#1E1E17]">Suspended</span>
            )}
            {contractInfo.affiliation_date && (
              <span className="rounded-full bg-[#E3EDFF] px-3 py-1 text-[#284B9F]">
                Affiliated: {formatDate(contractInfo.affiliation_date)}
              </span>
            )}
            {contractInfo.approval_date && (
              <span className="rounded-full bg-[#E3EDFF] px-3 py-1 text-[#284B9F]">
                Approved: {formatDate(contractInfo.approval_date)}
              </span>
            )}
          </div>
        </div>
      )}

      {(profile.academicTrainings.length > 0 ||
        profile.workExperiences.length > 0 ||
        profile.technicalSkills.length > 0 ||
        profile.workReferences.length > 0) && (
        <div className="grid gap-6">
          {profile.academicTrainings.length > 0 && (
            <div className="rounded-3xl border border-[#1E1E17]/10 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-black">
                <GraduationCap className="h-4 w-4 text-black" /> Academic training
              </h3>
              <div className="mt-4 space-y-3">
                {profile.academicTrainings.map((item) => (
                  <div
                    key={`${item.id ?? item.title}`}
                    className="rounded-2xl border border-black/10 bg-[#090909] p-4 text-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
                      <span>{item.title || "Training"}</span>
                      {item.degree && (
                        <span className="text-xs uppercase tracking-wide text-white/60">{item.degree}</span>
                      )}
                    </div>
                    {item.institution && <p className="mt-1 text-sm text-white/75">{item.institution}</p>}
                    <p className="mt-2 text-xs font-medium text-white/55">
                      {formatDate(item.start_date)} - {formatDate(item.end_date)}
                    </p>
                    {item.description && (
                      <p className="mt-2 text-xs leading-relaxed text-white/65">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.workExperiences.length > 0 && (
            <div className="rounded-3xl border border-[#1E1E17]/10 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-black">
                <BriefcaseBusiness className="h-4 w-4 text-black" /> Work experience
              </h3>
              <div className="mt-4 space-y-3">
                {profile.workExperiences.map((item) => (
                  <div
                    key={`${item.id ?? item.company_name}`}
                    className="rounded-2xl border border-black/10 bg-[#090909] p-4 text-white"
                  >
                    <div className="text-sm font-semibold">{item.company_name || "Company"}</div>
                    {item.position && <div className="text-sm text-white/75">{item.position}</div>}
                    <p className="mt-2 text-xs font-medium text-white/55">
                      {formatDate(item.start_date)} - {formatDate(item.end_date) || "Current"}
                    </p>
                    {item.description && (
                      <p className="mt-2 text-xs leading-relaxed text-white/65">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.technicalSkills.length > 0 && (
            <div className="rounded-3xl border border-[#1E1E17]/10 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-black">
                <Wrench className="h-4 w-4 text-black" /> Technical skills
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.technicalSkills.map((item) => (
                  <span
                    key={`${item.id ?? item.name}`}
                    className="rounded-full border border-black bg-black px-3 py-1 text-xs font-semibold text-white"
                  >
                    {item.name || "Skill"}
                    {item.level && (
                      <span className="ml-1 text-[10px] uppercase text-white/60">({item.level})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.workReferences.length > 0 && (
            <div className="rounded-3xl border border-[#1E1E17]/10 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-black">
                <UserCheck className="h-4 w-4 text-black" /> References
              </h3>
              <div className="mt-4 space-y-3">
                {profile.workReferences.map((item) => (
                  <div
                    key={`${item.id ?? item.email ?? item.phone}`}
                    className="rounded-2xl border border-black/10 bg-[#090909] p-4 text-white"
                  >
                    <div className="text-sm font-semibold">{item.name || "Reference"}</div>
                    {item.company_name && <div className="text-sm text-white/80">{item.company_name}</div>}
                    {item.position && (
                      <div className="text-xs font-medium uppercase tracking-wide text-white/60">{item.position}</div>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/70">
                      {item.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3 text-white" /> {item.phone}
                        </span>
                      )}
                      {item.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3 text-white" /> {item.email}
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="mt-2 text-xs leading-relaxed text-white/65">{item.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-3xl border border-black/10 bg-[#090909] p-5 text-xs font-medium text-white/75">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.28em] text-white/40">Identifiers</span>
            <div className="mt-1 space-y-1.5">
              <span className="block">User ID: {contractor.user_id}</span>
              {user?.id && <span className="block">Profile ID: {user.id}</span>}
            </div>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.28em] text-white/40">Geolocation</span>
            <div className="mt-1 space-y-1.5">
              <span className="block">
                Lat: {contractor.location?.lat ?? "-"}, Lng: {contractor.location?.lng ?? "-"}
              </span>
            </div>
          </div>
          {timestamps?.created_at && (
            <div>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-white/40">Created</span>
              <span className="mt-1 block">{formatDate(timestamps.created_at)}</span>
            </div>
          )}
          {timestamps?.updated_at && (
            <div>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-white/40">Updated</span>
              <span className="mt-1 block">{formatDate(timestamps.updated_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

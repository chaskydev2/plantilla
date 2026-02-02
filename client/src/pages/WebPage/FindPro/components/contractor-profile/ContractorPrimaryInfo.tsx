import { useEffect, useState } from "react";
// no longer need LucideIcon type here
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Compass,
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
} from "lucide-react";
import type { ContractorFullInfo } from "@/types/contractor";
import { motion } from "framer-motion";
import { borderPrimary } from "@/components/form-registration";
import { formatDate, getAvatar, getAvatarInitials } from "@/pages/WebPage/FindPro/utils/contractorProfile";
import type { ContractorProfileViewModel } from "@/pages/WebPage/FindPro/utils/contractorProfile";
import { ReviewService, type IRatingSummary } from "@/core/services/ReviewService";

interface ContractorPrimaryInfoProps {
  contractor: ContractorFullInfo;
  profile: ContractorProfileViewModel;
}

export function ContractorPrimaryInfo({ contractor, profile }: ContractorPrimaryInfoProps) {
  const user = profile.user;
  console.log(contractor);
  console.log(profile);  
  const [ratingSummary, setRatingSummary] = useState<IRatingSummary | null>(null);
  const ratingValue = ratingSummary?.average_rating ?? profile.ratingValue ?? 0;
  const contractInfo = profile.contractInfo;
  const timestamps = profile.timestamps;
  const professionNames = profile.professionNames ?? [];
  const tagNames = profile.tagNames ?? [];
  const academicTrainings = profile.academicTrainings ?? [];
  const workExperiences = profile.workExperiences ?? [];
  const technicalSkills = profile.technicalSkills ?? [];
  const workReferences = profile.workReferences ?? [];

  const hasAvatarImage = Boolean(contractor.avatar || contractor.user?.avatar);
  const avatarInitials = getAvatarInitials(profile.displayName);

  useEffect(() => {
    const contractorId = contractor.user_id ?? contractor.user?.id;
    if (!contractorId) return;

    ReviewService.getRatingSummary(Number(contractorId))
      .then((api) => {
        if (api?.success && api.data) {
          setRatingSummary(api.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load rating summary", err);
      });
  }, [contractor.user?.id, contractor.user_id]);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[2rem] border-2 shadow-2xl overflow-hidden bg-gradient-to-br from-white via-white to-gray-50/40"
        style={{ borderColor: "rgba(245, 210, 56, 0.3)", color: "var(--color-secondary)", ...borderPrimary }}
      >
        <div className="relative isolate overflow-hidden px-6 py-10 sm:px-12 md:px-16 lg:px-20">
          <div className="absolute -left-20 top-0 hidden h-40 w-40 rounded-full border-2 border-[#F5D238]/20 bg-gradient-to-br from-[#F5D238]/15 to-[#F5D238]/5 blur-2xl lg:block" aria-hidden />
          <div className="absolute -right-24 -bottom-12 hidden h-48 w-48 rounded-full border-2 border-[#F5D238]/15 bg-gradient-to-tl from-[#F5D238]/8 to-transparent opacity-50 blur-2xl lg:block" aria-hidden />
          <div className="absolute left-1/2 -top-20 hidden h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#F5D238]/4 to-transparent blur-3xl lg:block" aria-hidden />
          <div className="relative flex flex-col gap-4 lg:gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-row items-start gap-4 sm:gap-6 flex-1 min-w-0 z-10">
              <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 flex-shrink-0 items-center justify-center rounded-full border-[4px] border-[#F5D238] bg-gradient-to-br from-white via-gray-50 to-white shadow-[0_18px_40px_rgba(245,210,56,0.24),0_8px_18px_rgba(0,0,0,0.14)] ring-3 ring-[#F5D238]/12 z-20">
                <span className="pointer-events-none absolute inset-[-6px] rounded-full border border-[#F5D238]/25 blur-[1px]" aria-hidden />
                <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/70 via-transparent to-transparent" aria-hidden />
                <span className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#F5D238]/25 via-transparent to-transparent blur-xl opacity-60" aria-hidden />
                {hasAvatarImage ? (
                  <img
                    src={getAvatar(contractor)}
                    alt={profile.displayName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-[#1E1E17] drop-shadow-sm">
                    {avatarInitials}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {contractor.elite && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#F5D238] bg-gradient-to-r from-[#F5D238]/25 via-[#F5D238]/15 to-[#F5D238]/25 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-xs font-black text-[#1E1E17] shadow-md">
                      <ShieldCheck className="h-3 w-3" /> Elite
                    </span>
                  )}
                  {user?.verification && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400 bg-gradient-to-r from-emerald-50 to-emerald-100/60 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-xs font-black text-emerald-900 shadow-md">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#F5D238]/10 to-[#FFD700]/10 px-3 py-2 w-fit">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${index + 1 <= Math.round(ratingValue)
                          ? "fill-[#F5D238] text-[#F5D238]"
                          : "text-black/20"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm sm:text-base font-black text-[#1E1E17]">
                      {ratingValue ? ratingValue.toFixed(1) : "-"}
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-[#1E1E17]/60">/ 5.0</span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#1E1E17]/70">
                    {ratingSummary?.total_reviews ?? 0} reviews
                  </span>
                </div>

                {professionNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[8px] sm:text-xs font-semibold">
                    {professionNames.slice(0, 3).map((name) => (
                      <span
                        key={name}
                        className="rounded-full border border-black/20 bg-gradient-to-r from-black/10 to-black/5 px-2 py-0.5 text-[#1E1E17] shadow-sm transition-transform hover:scale-105 hover:border-[#F5D238] hover:from-[#F5D238]/20 hover:to-[#F5D238]/10"
                      >
                        {name}
                      </span>
                    ))}
                    {professionNames.length > 3 && (
                      <span className="rounded-full border border-[#F5D238] bg-gradient-to-r from-[#F5D238]/20 to-[#F5D238]/10 px-2 py-0.5 font-black text-[#1E1E17] shadow-sm text-[8px] sm:text-xs">
                        +{professionNames.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {contractor.bio && (
          <div className="space-y-4 sm:space-y-5 bg-gradient-to-b from-white to-gray-50/40 px-6 sm:px-8 pb-8 sm:pb-10 pt-6 sm:pt-8 md:px-16 lg:px-20">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-[#1E1E17]/60">About</span>
            <p className="rounded-3xl border-2 border-[#1E1E17]/12 bg-gradient-to-br from-[#0B0B0B] via-[#121212] to-[#0B0B0B] px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base leading-relaxed text-white/90 shadow-2xl">
              {contractor.bio}
            </p>
          </div>
        )}
      </motion.div>

      {contractor.company_info && (
        <div className="rounded-[2rem] border-2 border-[#F5D238]/25 bg-gradient-to-br from-[#090909] via-[#111] to-[#080808] p-10 shadow-2xl text-white">
          <div className="flex items-center gap-3 text-lg font-black mb-1">
            <Building2 className="h-6 w-6 text-[#F5D238]" /> Company details
          </div>
          <div className="mt-6 grid gap-5 text-base text-white/80 sm:grid-cols-2">
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
          </div>
        </div>
      )}

      {contractor?.team_members && contractor.team_members.length > 0 && (
        <div className="rounded-[2rem] border-2 border-[#F5D238]/25 bg-gradient-to-br from-[#090909] via-[#111] to-[#080808] p-10 shadow-2xl text-white">
          <div className="flex items-center gap-3 text-lg font-black mb-1">
            <Building2 className="h-6 w-6 text-[#F5D238]" /> Team Members
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {contractor.team_members.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-white/5 to-white/[0.02] p-4 border border-white/10 hover:border-[#F5D238]/30 transition-colors">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#F5D238]/20 to-[#F5D238]/5 border border-[#F5D238]/30 flex items-center justify-center">
                  {member.user?.profile_photo_url || member.photo_url ? (
                    <img 
                      src={member.user?.profile_photo_url || member.photo_url} 
                      alt={member.name} 
                      className="h-full w-full object-cover" 
                    />
                  ) : (
                    <span className="text-xs font-black text-[#F5D238]">
                      {member.name?.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white text-sm">{member.name}</p>
                  <p className="truncate text-xs text-white/60">{member.role || "Specialist"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border px-8 py-8 shadow-md"
          style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.28em] text-[#1E1E17]">
              <Phone className="h-5 w-5 text-[#1E1E17]" /> Direct Contact
            </h3>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#1E1E17]/40">
              Response time: fast
            </span>
          </div>
          <div className="mt-5 space-y-3.5 text-sm text-black/75">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border px-8 py-8 shadow-md"
          style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
        >
          <h3 className="flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.28em] text-[#1E1E17] mb-1">
            <Compass className="h-5 w-5 text-[#1E1E17]" /> Location & Coverage
          </h3>
          <div className="mt-5 space-y-3.5 text-sm text-black/75">
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
        </motion.div>
      </div>

      {professionNames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border px-8 py-8 shadow-md"
          style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
        >
          <div className="flex items-center gap-2.5 text-base font-semibold text-black mb-1">
            <Briefcase className="h-5 w-5 text-black" /> Professions
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {professionNames.map((name) => (
              <span key={name} className="rounded-full border border-black px-3 py-1 text-xs font-semibold text-white bg-black">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {tagNames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border px-8 py-8 shadow-md"
          style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
        >
          <div className="flex items-center gap-2.5 text-base font-semibold text-black mb-1">
            <Tags className="h-5 w-5 text-black" /> Tags
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {tagNames.map((name) => (
              <span
                key={name}
                className="rounded-full border border-black px-3 py-1 text-xs font-semibold text-white bg-black shadow-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {(academicTrainings.length > 0 ||
        workExperiences.length > 0 ||
        technicalSkills.length > 0 ||
        workReferences.length > 0) && (
        <div className="grid gap-6">
          {academicTrainings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border px-8 py-8 shadow-md"
              style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
            >
              <h3 className="flex items-center gap-2.5 text-base font-semibold uppercase tracking-wide text-black mb-1">
                <GraduationCap className="h-5 w-5 text-black" /> Academic training
              </h3>
              <div className="mt-5 space-y-4">
              {academicTrainings.map((item) => (
                <div
                  key={`${item.id ?? item.academic_degree }`}
                  className="rounded-2xl border border-black/10 bg-[#090909] p-5 text-white shadow-lg transition-transform hover:scale-[1.01]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
                    <span className="text-blue-400">{item.professional_title || "Formación"}</span>
                    {item.academic_degree && (
                      <span className="text-xs uppercase tracking-wide text-white/60 bg-white/5 px-2 py-1 rounded">
                        {item.academic_degree}
                      </span>
                    )}
                  </div>
                  
                  {item.graduated_from && (
                    <p className="mt-1 text-sm text-white/75 font-medium italic">
                      {item.graduated_from}
                    </p>
                  )}
                  
                  <p className="mt-2 text-xs font-medium text-white/55">
                    {formatDate(item.graduation_date)} — {formatDate(item.degree_date)}
                  </p>
                  
                  {item.relevant_certifications && (
                    <p className="mt-2 text-xs leading-relaxed text-white/65 border-l border-white/10 pl-3">
                      {item.relevant_certifications}
                    </p>
                  )}
                </div>
              ))}
            </div>
            </motion.div>
          )}

          {workExperiences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border px-8 py-8 shadow-md"
              style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
            >
              <h3 className="flex items-center gap-2.5 text-base font-semibold uppercase tracking-wide text-black mb-1">
                <BriefcaseBusiness className="h-5 w-5 text-black" /> Work experience
              </h3>
              <div className="mt-5 space-y-4">
                {workExperiences.map((item) => (
                  <div
                    key={`${item.id ?? item.company_name}`}
                    className="rounded-2xl border border-black/10 bg-[#090909] p-5 text-white"
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
            </motion.div>
          )}

          {technicalSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border px-8 py-8 shadow-md"
              style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
            >
              <h3 className="flex items-center gap-2.5 text-base font-semibold uppercase tracking-wide text-black mb-1">
                <Wrench className="h-5 w-5 text-black" /> Technical skills
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {technicalSkills.map((item) => (
                  <span
                    key={`${item.id ?? item.skill_name}`}
                    className="rounded-full border border-black bg-black px-3 py-1 text-xs font-semibold text-white"
                  >
                    {item.skill_name || "Skill"}
                    {item.skill_level && (
                      <span className="ml-1 text-[10px] uppercase text-white/60">({item.skill_level})</span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {workReferences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border px-8 py-8 shadow-md"
              style={{ background: "white", color: "var(--color-secondary)", ...borderPrimary }}
            >
              <h3 className="flex items-center gap-2.5 text-base font-semibold uppercase tracking-wide text-black mb-1">
                <UserCheck className="h-5 w-5 text-black" /> References
              </h3>
              <div className="mt-5 space-y-4">
                {workReferences.map((item) => (
                  <div
                    key={`${item.id ?? item.email ?? item.phone}`}
                    className="rounded-2xl border border-black/10 bg-[#090909] p-5 text-white"
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
            </motion.div>
          )}
        </div>
      )}

      <div className="rounded-3xl border border-black/10 bg-[#090909] p-8 text-xs font-medium text-white/75">
        <div className="grid gap-6 sm:grid-cols-2">
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

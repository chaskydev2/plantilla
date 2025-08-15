import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserMetaCard from "@/components/UserProfile/UserMetaCard";
import UserInfoCard from "@/components/UserProfile/UserInfoCard";
import UserAcademicTraining from "@/components/UserProfile/UserAcademicTraining";
import UserWorkExperience from "@/components/UserProfile/UserWorkExperience";
import UserTechnicalSkill from "@/components/UserProfile/UserTechnicalSkill";
import UserWorkReference from "@/components/UserProfile/UserWorkReference";
import type { IProfile } from "@/core/types/IProfile";
import { ProfileService } from "@/core/services/auth/profile.service";

export default function UserProfiles() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeProfile();
  }, []);

  const initializeProfile = async () => {
    setLoading(true);
    await ProfileService.profile().then((response) => {
      setProfile(response.data);
    }).catch((error) => {
      console.error("Error fetching profile:", error);
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <PageBreadcrumb pageTitle="Perfil" />
      <div className="flex flex-col gap-5">
        <UserMetaCard user={profile} load={initializeProfile} isLoading={loading} />
        <UserInfoCard user={profile} load={initializeProfile} isLoading={loading} />
        <UserAcademicTraining />
        <UserWorkExperience />
        <UserTechnicalSkill />
        <UserWorkReference />
      </div>
    </div>
  );
}

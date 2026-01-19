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
  const [isHomeowner, setIsHomeowner] = useState(false);

  useEffect(() => {
    initializeProfile();
    detectRoleFromLocalStorage();
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

  const detectRoleFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user_data");
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);
      const roleName = parsed.role_name || parsed.role?.name;
      const roleId = parsed.role_id;
      const roles = parsed.roles || [];

      const homeowner =
        roleName?.toLowerCase() === "homeowner" ||
        roleId === 4 ||
        roles.some((r: any) => r.name?.toLowerCase() === "homeowner" || r.id === 4);

      setIsHomeowner(Boolean(homeowner));
    } catch (error) {
      console.error("Error parsing user_data from localStorage", error);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <PageBreadcrumb pageTitle="Perfil" />
      <div className="flex flex-col gap-5">
        {/* 12 Column Grid Layout for UserMetaCard and UserInfoCard */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-12">
            <UserMetaCard user={profile} load={initializeProfile} isLoading={loading} />
          </div>
          <div className="col-span-12 lg:col-span-12">
            <UserInfoCard user={profile} load={initializeProfile} isLoading={loading} />
          </div>
        </div>
        
        {!isHomeowner && (
          <>
            {/* 12 Column Grid Layout for Additional Components */}
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 lg:col-span-6">
                <UserAcademicTraining />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <UserWorkExperience />
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 lg:col-span-6">
                <UserTechnicalSkill />
              </div>
              <div className="col-span-12 lg:col-span-6">
                <UserWorkReference />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

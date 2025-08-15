import { useEffect, useState, useMemo } from "react";
import { UserService } from "@/core/services/user/user.service";
import type { IProfile } from "@/core/types/IProfile";
import { toastify } from "@/core/utils/toastify";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Printer } from "lucide-react";

export default function UserShow() {
const [user, setUser] = useState<IProfile | null>(null);
const [isLoading, setIsLoading] = useState(true);
const { id } = useParams();
const navigate = useNavigate();

useEffect(() => {
    if (id) initializeProfile();
}, [id]);

const initializeProfile = async () => {
    setIsLoading(true);
    await UserService.get(id)
    .then((response) => {
        setUser(response.data);
    })
    .catch((error) => {
        toastify.error(error.message || "Error al cargar los datos del usuario");
        setUser(null);
    })
    .finally(() => {
        setIsLoading(false);
    });
};

const handleGoBack = () => {
    navigate("/admin/usuarios");
};

const handlePrint = () => {
    window.print();
};

const FieldSkeleton = () => (
    <div className="space-y-2">
    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    </div>
);

const SectionSkeleton = () => (
    <div className="space-y-6">
    <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(6)].map((_, i) => (
        <FieldSkeleton key={i} />
        ))}
    </div>
    </div>
);

const groupedSkills = useMemo(() => {
    if (!user?.skills) return null;

    const groups = {
    software: [] as typeof user.skills,
    equipment: [] as typeof user.skills,
    technical: [] as typeof user.skills,
    };

    user.skills.forEach((skill) => {
    const type = skill.skill_type?.toLowerCase();
    if (type === "software") {
        groups.software.push(skill);
    } else if (type === "equipment") {
        groups.equipment.push(skill);
    } else if (type === "technical") {
        groups.technical.push(skill);
    }
    });

    return groups;
}, [user?.skills]);

if (isLoading) {
    return (
    <div className="min-h-screen p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-2xl lg:p-6 space-y-8">
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
    </div>
    );
}

if (!user) {
    return (
    <div className="min-h-screen p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-2xl lg:p-6 flex items-center justify-center">
        <div className="alert alert-error shadow-lg max-w-md w-full bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-200">
        <div className="flex items-center gap-2">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            </svg>
            <span>No se pudieron cargar los datos del usuario</span>
        </div>
        <button
            className="btn btn-sm btn-ghost mt-2 dark:text-gray-100"
            onClick={initializeProfile}
            type="button"
        >
            Reintentar
        </button>
        </div>
    </div>
    );
}

return (
    <div className="min-h-screen p-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-2xl lg:p-6 space-y-8">
      {/* Barra de acciones */}
    <div className="flex justify-between items-center mb-6 print:hidden">
        <button
        onClick={handleGoBack}
        className="btn btn-outline btn-sm flex items-center gap-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
        type="button"
        >
        <ArrowLeft className="h-4 w-4" />
        Volver
        </button>
        <button
        onClick={handlePrint}
        className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 hover:from-green-500 hover:via-emerald-600 hover:to-green-700 text-white font-bold py-3 px-10 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm flex items-center gap-2"
        type="button"
        >
        <Printer className="h-4 w-4" />
        Imprimir
        </button>
    </div>

      {/* Información Personal */}
    <div className="card bg-white dark:bg-gray-800 shadow-md">
        <div className="card-body">
        <h2 className="card-title text-lg font-semibold">Información Personal</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Campos */}
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Nombre</label>
            <p className="font-medium">{user.first_name || "No especificado"}</p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Apellido</label>
            <p className="font-medium">{user.last_name || "No especificado"}</p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Carnet de identidad</label>
            <p className="font-medium">{user.ci || "No especificado"}</p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Fecha de afiliación</label>
            <p className="font-medium">{user.college_affiliation_date || "No especificado"}</p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Teléfono</label>
            <p className="font-medium">{user.phone_number || "No especificado"}</p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Celular</label>
            <p className="font-medium">{user.mobile_number || "No especificado"}</p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">LinkedIn</label>
            <p className="font-medium">
                {user.linkedin_url ? (
                <a
                    href={user.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                >
                    {user.linkedin_url}
                </a>
                ) : (
                "No especificado"
                )}
            </p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Portfolio</label>
            <p className="font-medium">
                {user.portfolio_url ? (
                <a
                    href={user.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                >
                    {user.portfolio_url}
                </a>
                ) : (
                "No especificado"
                )}
            </p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Disponibilidad de viajar</label>
            <p className="font-medium">
                <span
                className={`badge ${
                    user.travel_availability ? "badge-success" : "badge-error"
                }`}
                >
                {user.travel_availability ? "Sí" : "No"}
                </span>
            </p>
            </div>
            <div className="space-y-1">
            <label className="label-text text-sm opacity-70">Licencia de conducir</label>
            <p className="font-medium">
                {user.has_driving_license ? (
                <span className="badge badge-success">
                    {user.driving_license_category || "Sí (sin categoría)"}
                </span>
                ) : (
                <span className="badge badge-error">No</span>
                )}
            </p>
            </div>
            {user.professional_summary && (
            <div className="lg:col-span-2 space-y-1">
                <label className="label-text text-sm opacity-70">Resumen profesional</label>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded">
                <p className="whitespace-pre-line">{user.professional_summary}</p>
                </div>
            </div>
            )}
        </div>
        </div>
    </div>

      {/* Formación Académica */}
    {user.academics?.length > 0 && (
        <div className="card bg-white dark:bg-gray-800 shadow-md">
        <div className="card-body">
            <h2 className="card-title text-lg font-semibold">Formación Académica</h2>
            <div className="space-y-6">
            {user.academics.map((academic, index) => (
                <div
                key={index}
                className="border-b border-gray-300 dark:border-gray-600 pb-6 last:border-0 last:pb-0"
                >
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="font-bold">{academic.professional_title}</h3>
                    <p className="text-sm opacity-80">{academic.graduated_from}</p>
                    </div>
                    <div className="text-right">
                    <p className="text-sm opacity-70">
                        Egreso: {academic.graduation_date || "Presente"}
                    </p>
                    <p className="text-sm opacity-70">
                        Título: {academic.degree_date || "No especificado"}
                    </p>
                    </div>
                </div>

                {academic.relevant_certifications && (
                    <div className="mt-3">
                    <label className="label-text text-sm opacity-70">
                        Certificaciones relevantes
                    </label>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded mt-1">
                        <pre className="whitespace-pre-wrap font-sans">
                        {academic.relevant_certifications}
                        </pre>
                    </div>
                    </div>
                )}
                </div>
            ))}
            </div>
        </div>
        </div>
    )}

      {/* Habilidades Técnicas */}
    {groupedSkills && (
        <div className="card bg-white dark:bg-gray-800 shadow-md">
        <div className="card-body">
            <h2 className="card-title text-lg font-semibold mb-6">Habilidades Técnicas</h2>

            {/* Grupo Software */}
            {groupedSkills.software.length > 0 && (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                <h3 className="text-md font-semibold">Software</h3>
                <span className="badge badge-primary">{groupedSkills.software.length}</span>
                </div>
                <SkillList skills={groupedSkills.software} />
            </div>
            )}

            {/* Grupo Equipment */}
            {groupedSkills.equipment.length > 0 && (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                <h3 className="text-md font-semibold">Equipos</h3>
                <span className="badge badge-secondary">{groupedSkills.equipment.length}</span>
                </div>
                <SkillList skills={groupedSkills.equipment} />
            </div>
            )}

            {/* Grupo Technical */}
            {groupedSkills.technical.length > 0 && (
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                <h3 className="text-md font-semibold">Habilidades Técnicas</h3>
                <span className="badge badge-accent">{groupedSkills.technical.length}</span>
                </div>
                <SkillList skills={groupedSkills.technical} />
            </div>
            )}

            {groupedSkills.software.length === 0 &&
            groupedSkills.equipment.length === 0 &&
            groupedSkills.technical.length === 0 && (
                <div className="alert alert-warning">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="stroke-current shrink-0 w-6 h-6"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                </svg>
                <span>No se encontraron habilidades registradas</span>
                </div>
            )}
        </div>
        </div>
    )}

      {/* Experiencia Laboral */}
    {user.experiences?.length > 0 && (
        <div className="card bg-white dark:bg-gray-800 shadow-md">
        <div className="card-body">
            <h2 className="card-title text-lg font-semibold">Experiencia Laboral</h2>
            <div className="space-y-6">
            {user.experiences.map((exp, index) => (
                <div
                key={index}
                className="border-b border-gray-300 dark:border-gray-600 pb-6 last:border-0 last:pb-0"
                >
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="font-bold">{exp.position}</h3>
                    <p className="text-sm opacity-80">{exp.company_name}</p>
                    </div>
                    <div className="text-right">
                    <p className="text-sm opacity-70">
                        {exp.start_date} - {exp.end_date || "Presente"}
                    </p>
                    </div>
                </div>

                {exp.responsibilities && (
                    <div className="mt-3">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                        <pre className="whitespace-pre-wrap font-sans">{exp.responsibilities}</pre>
                    </div>
                    </div>
                )}
                </div>
            ))}
            </div>
        </div>
        </div>
    )}

      {/* Referencias Laborales */}
    {user.references?.length > 0 && (
        <div className="card bg-white dark:bg-gray-800 shadow-md">
        <div className="card-body">
            <h2 className="card-title text-lg font-semibold">Referencias Laborales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.references.map((ref, index) => (
                <div key={index} className="card bg-gray-100 dark:bg-gray-700 shadow">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm">{ref.reference_name}</h3>
                    <p className="text-sm opacity-80">
                    {ref.position} - {ref.company}
                    </p>
                    <div className="mt-2 space-y-1">
                    <p className="text-sm">
                        <span className="font-semibold">Teléfono:</span> {ref.phone || "No especificado"}
                    </p>
                    <p className="text-sm">
                        <span className="font-semibold">Email:</span> {ref.email || "No especificado"}
                    </p>
                    </div>
                    {ref.additional_notes && (
                    <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{ref.additional_notes}</pre>
                    </div>
                    )}
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    )}
    </div>
);
}

const SkillList = ({ skills }: { skills: Array<any> }) => (
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {skills.map((skill, index) => (
    <div key={index} className="card bg-gray-100 dark:bg-gray-700 shadow-sm">
        <div className="card-body p-4">
        <div className="flex justify-between items-start">
            <h4 className="font-medium">{skill.skill_name}</h4>
            <div className="flex items-center gap-2">
            {skill.skill_level && (
                <span className="badge badge-outline badge-sm">{skill.skill_level}</span>
            )}
            </div>
        </div>

        {skill.description && (
            <p className="text-sm mt-2 opacity-80 whitespace-pre-line">{skill.description}</p>
        )}

        {skill.certifications && (
            <div className="mt-2">
            <div className="collapse collapse-arrow border border-gray-300 dark:border-gray-600 rounded">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium p-2">Certificaciones</div>
                <div className="collapse-content p-2">
                <pre className="whitespace-pre-wrap text-sm">{skill.certifications}</pre>
                </div>
            </div>
            </div>
        )}
        </div>
    </div>
    ))}
</div>
);

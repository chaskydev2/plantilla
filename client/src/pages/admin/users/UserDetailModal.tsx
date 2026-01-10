import React, { useState, useEffect } from "react";
import Modal from "@/components/modal/Modal";
import { toastify } from "@/core/utils/toastify";
import type { IUserResponse } from "@/core/types/IUser";

import { getUserInformation } from '@/core/services/user/user.service';

interface UserDetailModalProps {
  user: IUserResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: number, status: boolean) => Promise<void>;
}

const h = React.createElement;



const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose, onStatusChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [localStatus, setLocalStatus] = useState<number>(user?.verification ? 1 : 0);
  const [editProfile, setEditProfile] = useState<boolean>(!!user?.edit_profile);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setLocalStatus(user?.verification ? 1 : 0);
    setEditProfile(!!user?.edit_profile);
    if (user && isOpen) {
      setLoadingInfo(true);
      getUserInformation(user.id)
        .then((res) => {
          setUserInfo(res.data);
        })
        .catch(() => {
          toastify.error("Error al obtener información del usuario");
        })
        .finally(() => setLoadingInfo(false));
    } else {
      setUserInfo(null);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  if (!user) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? 1 : 0;
    setLocalStatus(newStatus);
    setIsProcessing(true);
    try {
      await onStatusChange(user.id, newStatus === 1);
      toastify.success("Estado actualizado");
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || err?.message || "Error al cambiar estado");
      setLocalStatus(newStatus === 1 ? 0 : 1); // revert
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler para el checkbox de editar perfil (solo cambia el estado local, aquí puedes agregar lógica para guardar en backend si lo deseas)
  const handleEditProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setEditProfile(checked);
    setIsProcessing(true);
    try {
      // Llama al servicio para actualizar el estado de edit_profile
      const { updateEditProfileStatus } = require('@/core/services/user/user.service');
      await updateEditProfileStatus(user.id, checked);
      toastify.success("Permiso de edición actualizado");
    } catch (err: any) {
      toastify.error(err?.response?.data?.message || err?.message || "Error al cambiar permiso de edición");
      setEditProfile(!checked); // revertir si falla
    } finally {
      setIsProcessing(false);
    }
  };


  return h(Modal, {
    isOpen,
    onClose,
    title: `Usuario: ${user.name}`,
    size: isFullscreen ? "full" : "lg",
    bodyMaxHeightClass: isFullscreen ? "max-h-[85vh]" : "max-h-[60vh]",
    children: h(
      "div",
      { className: "space-y-6" },
      h("div", { className: "flex justify-end" },
        h("button", {
          type: "button",
          className: "btn btn-sm btn-outline",
          onClick: () => setIsFullscreen((prev) => !prev),
        }, isFullscreen ? "Vista normal" : "Expandir")
      ),
      loadingInfo
        ? h("div", { className: "text-center py-8 text-lg font-semibold" }, "Cargando información...")
        : userInfo && h(React.Fragment, {},
            // Datos principales
            h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-100 rounded-lg shadow p-4" },
              h("div", {},
                h("div", { className: "font-bold text-lg mb-2" }, userInfo.name),
                h("div", {}, h("span", { className: "font-semibold" }, "ID:"), " ", userInfo.id),
                h("div", {}, h("span", { className: "font-semibold" }, "Email:"), " ", userInfo.email),
                h("div", {}, h("span", { className: "font-semibold" }, "CI:"), " ", userInfo.ci || "-"),
                h("div", {}, h("span", { className: "font-semibold" }, "Tel. móvil:"), " ", userInfo.mobile_number || "-"),
                h("div", {}, h("span", { className: "font-semibold" }, "Tel. fijo:"), " ", userInfo.phone_number || "-"),
                h("div", {}, h("span", { className: "font-semibold" }, "Dirección:"), " ", userInfo.address || "-")
              ),
              h("div", {},
                h("div", {}, h("span", { className: "font-semibold" }, "Estado:"),
                  h("label", { className: "flex items-center gap-2 ml-2" },
                    h("input", {
                      type: "checkbox",
                      className: "toggle toggle-success",
                      checked: localStatus === 1,
                      onChange: handleStatusChange,
                      disabled: isProcessing,
                    }),
                    h(
                      "span",
                      {
                        className:
                          localStatus === 1
                            ? "badge badge-success"
                            : "badge badge-danger"
                      },
                      localStatus === 1 ? "Activo" : "Inactivo"
                    )
                  )
                ),
                h("div", {}, h("span", { className: "font-semibold" }, "Roles:"), " ", (user.roles || []).map((r: any) => r.name).join(", ")),
                h("div", {}, h("span", { className: "font-semibold" }, "Verificado:"), " ", userInfo.verification ? "Sí" : "No"),
                h("div", {}, h("span", { className: "font-semibold" }, "Permiso de edición:"), " ", userInfo.edit_profile ? "Sí" : "No"),
                h("div", {}, h("span", { className: "font-semibold" }, "Creado:"), " ", userInfo.created_at ? new Date(userInfo.created_at).toLocaleString() : "-"),
                h("div", {}, h("span", { className: "font-semibold" }, "Actualizado:"), " ", userInfo.updated_at ? new Date(userInfo.updated_at).toLocaleString() : "-")
              )
            ),
            // Sección de datos adicionales
            h("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
              h("div", { className: "bg-base-100 rounded-lg shadow p-4" },
                h("div", { className: "font-semibold mb-2" }, "Entrenamientos académicos"),
                (userInfo.academic_trainings && userInfo.academic_trainings.length > 0)
                  ? h("ul", { className: "list-disc ml-6" }, userInfo.academic_trainings.map((t: any, i: number) => h("li", { key: i }, t)))
                  : h("div", { className: "text-gray-500" }, "Sin datos")
              ),
              h("div", { className: "bg-base-100 rounded-lg shadow p-4" },
                h("div", { className: "font-semibold mb-2" }, "Experiencia laboral"),
                (userInfo.work_experiences && userInfo.work_experiences.length > 0)
                  ? h("ul", { className: "list-disc ml-6" }, userInfo.work_experiences.map((t: any, i: number) => h("li", { key: i }, t)))
                  : h("div", { className: "text-gray-500" }, "Sin datos")
              ),
              h("div", { className: "bg-base-100 rounded-lg shadow p-4" },
                h("div", { className: "font-semibold mb-2" }, "Habilidades técnicas"),
                (userInfo.technical_skills && userInfo.technical_skills.length > 0)
                  ? h("ul", { className: "list-disc ml-6" }, userInfo.technical_skills.map((t: any, i: number) => h("li", { key: i }, t)))
                  : h("div", { className: "text-gray-500" }, "Sin datos")
              ),
              h("div", { className: "bg-base-100 rounded-lg shadow p-4" },
                h("div", { className: "font-semibold mb-2" }, "Referencias laborales"),
                (userInfo.work_references && userInfo.work_references.length > 0)
                  ? h("ul", { className: "list-disc ml-6" }, userInfo.work_references.map((t: any, i: number) => h("li", { key: i }, t)))
                  : h("div", { className: "text-gray-500" }, "Sin datos")
              )
            ),
            // Datos de contratista
            userInfo.contractor && h("div", { className: "bg-base-100 rounded-lg shadow p-4" },
              h("div", { className: "font-semibold mb-2" }, "Datos de contratista"),
              h("div", {}, h("span", { className: "font-semibold" }, "Empresa:"), " ", userInfo.contractor.company_name || "-"),
              h("div", {}, h("span", { className: "font-semibold" }, "Licencia:"), " ", userInfo.contractor.license_number || "-"),
              h("div", {}, h("span", { className: "font-semibold" }, "Asegurado:"), " ", userInfo.contractor.is_insured ? "Sí" : "No"),
              h("div", {}, h("span", { className: "font-semibold" }, "Área de servicio:"), " ", userInfo.contractor.service_area || "-"),
              h("div", {}, h("span", { className: "font-semibold" }, "País:"), " ", userInfo.contractor.country_code || "-"),
              h("div", {}, h("span", { className: "font-semibold" }, "Portafolio:"), " ", userInfo.contractor.portfolio_url ? h("a", { href: userInfo.contractor.portfolio_url, target: "_blank", rel: "noopener noreferrer", className: "link link-primary" }, userInfo.contractor.portfolio_url) : "-")
            ),
            // Documentos
            h("div", { className: "bg-base-100 rounded-lg shadow p-4" },
              h("div", { className: "font-semibold mb-2" }, "Documentos del usuario"),
              (() => {
                const contractorDocs = userInfo.contractor_attributes || [];
                const homeownerDocs = userInfo.homeowner_attributes || [];
                const hasDocs = contractorDocs.length > 0 || homeownerDocs.length > 0;

                const renderDocs = (docs: any[], label: string) =>
                  docs.length > 0 && h("div", { className: "mb-4" },
                    h("div", { className: "font-semibold mb-2" }, label),
                    h("ul", { className: "space-y-4" },
                      docs.map((attr: any) => h("li", { key: attr.id || `${label}-${attr.attribute?.id || attr.attribute?.name || "doc"}` , className: "border-b pb-2" },
                        h("div", { className: "flex items-center gap-2" },
                          h("b", {}, attr.attribute?.name || "Documento"),
                          attr.status === 1
                            ? h("span", { className: "badge badge-success" }, "Aprobado")
                            : h("span", { className: "badge badge-warning" }, "Pendiente")
                        ),
                        h("div", { className: "mt-2" },
                          attr.value
                            ? (
                                String(attr.value).toLowerCase().endsWith('.pdf')
                                  ? h("iframe", {
                                      src: attr.value.startsWith('http') ? attr.value : `http://localhost:8000/${attr.value}`,
                                      style: { width: "100%", height: "350px", border: "1px solid #ccc", marginTop: "8px" },
                                      title: `PDF-${attr.id || attr.attribute?.id || attr.attribute?.name || 'doc'}`
                                    })
                                  : h("a", { href: attr.value.startsWith('http') ? attr.value : `http://localhost:8000/${attr.value}`, target: "_blank", rel: "noopener noreferrer", className: "link link-info" }, "Ver documento")
                              )
                            : h("span", { className: "text-gray-500" }, "Sin archivo")
                        ),
                        attr.coment && attr.coment.length > 0 && h("div", { className: "text-xs text-gray-500 mt-1" }, "Comentario: ", attr.coment)
                      ))
                    )
                  );

                if (!hasDocs) return h("div", { className: "text-gray-500" }, "No hay documentos enviados.");

                return h(React.Fragment, {},
                  renderDocs(contractorDocs, "Documentos de contratista"),
                  renderDocs(homeownerDocs, "Documentos de homeowner")
                );
              })()
            )
          )
    )
  });
};

export default UserDetailModal;

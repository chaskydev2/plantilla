import { useEffect, useMemo, useState } from "react";
import { RequirementService } from "@/core/services/requirement/requirement.service";
import type { IRequirement } from "@/core/types/IRequirement";

export default function JoinAsPro() {
  const [requirements, setRequirements] = useState<IRequirement[]>([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [selectedReqType, setSelectedReqType] = useState<
    "all" | "Registration" | "Renewal" | "Information Update"
  >("all");

  const REQUIREMENT_TYPES = [
    "Registration",
    "Renewal",
    "Information Update",
  ] as const;

  useEffect(() => {
    async function fetchRequirements() {
      setReqLoading(true);
      try {
        const res = await RequirementService.getAll();
        const list = Array.isArray(res.data) ? res.data : [];
        list.sort((a: IRequirement, b: IRequirement) => {
          const ao = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
          const bo = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
          return ao - bo;
        });
        setRequirements(list);
      } catch (err) {
        console.log("Error fetching requirements:", err);
        setRequirements([]);
      } finally {
        setReqLoading(false);
      }
    }

    fetchRequirements();
  }, []);

  function FileIcon() {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          d="M4 4a2 2 0 012-2h7.586a2 2 0 011.414.586l3.414 3.414A2 2 0 0120 7.414V20a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 9h6M8 13h6M8 17h4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function normalizeRequirementType(
    type?: string | null
  ): "Registration" | "Renewal" | "Information Update" {
    const normalized = (type ?? "").trim().toLowerCase().replace(/\s+/g, " ");
    if (normalized === "registration" || normalized === "registratiion") {
      return "Registration";
    }

    if (
      normalized === "renewal" ||
      normalized === "renewal information" ||
      normalized === "renewalinformation" ||
      normalized === "renewal-info"
    ) {
      return "Renewal";
    }

    if (
      normalized === "information update" ||
      normalized === "informationupdate" ||
      normalized === "update" ||
      normalized === "updates"
    ) {
      return "Information Update";
    }

    return "Information Update";
  }

  const requirementsByType = useMemo(() => {
    const grouped: Record<
      "Registration" | "Renewal" | "Information Update",
      IRequirement[]
    > = {
      Registration: [],
      Renewal: [],
      "Information Update": [],
    };

    for (const req of requirements) {
      const type = normalizeRequirementType((req as any).type);
      grouped[type].push(req);
    }

    return grouped;
  }, [requirements]);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-[#1A1B16] text-white py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <h1 className="text-4xl md:text-6xl font-extrabold">Join as Pro</h1>
          <p className="mt-4 text-lg text-gray-300">
            Check the requirements to join as a professional at GU.
          </p>
        </div>
      </section>

      {/* Requirements - List Style Card */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          {reqLoading ? (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Loading requirements...</span>
            </div>
          ) : requirements.length === 0 ? (
            <div className="text-gray-500">
              No requirements available at this time.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReqType("all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ring-1 transition ${
                    selectedReqType === "all"
                      ? "bg-primary text-[#1A1B16] ring-primary"
                      : "bg-white text-[#1A1B16] ring-[#1A1B16]/15 hover:ring-[#1A1B16]/30"
                  }`}
                >
                  All
                </button>
                {REQUIREMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedReqType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ring-1 transition ${
                      selectedReqType === type
                        ? "bg-primary text-[#1A1B16] ring-primary"
                        : "bg-white text-[#1A1B16] ring-[#1A1B16]/15 hover:ring-[#1A1B16]/30"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Groups */}
              <div className="space-y-8">
                {(selectedReqType === "all"
                  ? REQUIREMENT_TYPES
                  : [selectedReqType]
                ).map((type) => {
                  const list = requirementsByType[type];
                  if (!list || list.length === 0) return null;
                  return (
                    <div
                      key={type}
                      className="rounded-2xl overflow-hidden border border-[#1A1B16]/10 bg-white shadow-sm"
                    >
                      <div className="bg-primary text-[#1A1B16] px-6 py-4 font-extrabold text-2xl">
                        {type}
                      </div>
                      <ul className="divide-y divide-primary/20">
                        {list.map((req) => (
                          <li
                            key={req.id}
                            className="bg-[#F7FAFF]"
                            style={{
                              background: "white",
                              color: "var(--color-secondary)",
                              borderColor: "var(--color-secondary)",
                              opacity: 1,
                              transform: "none",
                            }}
                          >
                            <div className="flex items-center gap-4 px-6 py-4">
                              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-primary ring-1 ring-primary/30">
                                <FileIcon />
                              </div>
                              <div className="flex-1">
                                <div className="text-[#1A1B16] font-medium">
                                  {req.title}
                                </div>
                                {req.description && (
                                  <div className="text-sm text-gray-600">
                                    {req.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export interface IAcademic {
  id: any;
  professional_title: string;
  academic_degree: string;
  graduated_from: string;
  relevant_certifications: string;
  graduation_date: string;
  degree_date: string;
  
}
export interface IAcademicCreateRequest {
  professional_title: string;
  academic_degree: string;
  graduated_from: string;
  relevant_certifications: string;
  graduation_date: string;
  degree_date: string;
}

export interface IAcademicUpdateRequest {
  professional_title: string;
  academic_degree: string;
  graduated_from: string;
  relevant_certifications: string;
  graduation_date: string;
  degree_date: string;
}

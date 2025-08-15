export interface ITechnicalSkill {
  id: any;
  user_id: string;
  skill_type: string;
  skill_name: string;
  skill_level: string;
  description: string;
}
export interface ITechnicalSkillCreateRequest {
  skill_type: string;
  skill_name: string;
  skill_level: string;
  description: string;
}

export interface ITechnicalSkillUpdateRequest {
  skill_type: string;
  skill_name: string;
  skill_level: string;
  description: string;
}

export interface IEvent {
  id: any;
  name: string;
  event_type_id: string;
  start_date: string;
  end_date: string;
  location: string;
  generates_fine: boolean;
}

export interface IEventCreateRequest {
  name: string;
  event_type_id: string;
  start_date: string;
  end_date: string;
  location: string;
  generates_fine: boolean;
}

export interface IEventUpdateRequest {
  name: string;
  event_type_id: string;
  start_date: string;
  end_date: string;
  location: string;
  generates_fine: boolean;
}

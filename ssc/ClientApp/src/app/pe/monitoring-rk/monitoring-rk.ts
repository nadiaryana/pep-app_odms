export interface MonitoringRK {
  _id: string;
  well: string;
  job: string;
  rig: string;
  plan_start: Date;
  plan_end: Date;
}

export interface MonitoringRKTmp {
  _id: string;
  well: string;
  job: string;
  rig: string;
  plan_start: Date;
  plan_end: Date;
  info?: string;
}

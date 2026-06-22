/** Monitoring RK — model data utama sesuai MonitoringRK.cs */
export interface MonitoringRK {
  _id: string;
  well: string;
  job: string;
  rig: string;
  plan_start: Date;
  plan_end: Date;
  pop?: Date;
  target_oil?: number;
  target_gas?: number;
  realisasi_oil?: number;
  realisasi_gas?: number;
  remarks?: string;
  created_by?: string;
  created_date?: Date;
  updated_by?: string;
  updated_date?: Date;
}

/** Monitoring RK Tmp — untuk data upload sementara */
export interface MonitoringRKTmp {
  _id: string;
  well: string;
  job: string;
  rig: string;
  plan_start: Date;
  plan_end: Date;
  info?: string;
}

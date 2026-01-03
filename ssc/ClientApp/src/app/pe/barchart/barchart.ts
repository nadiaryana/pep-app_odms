export interface Barchart {
  _id: string;
  well: string;
  job: string;
  rig: string;
  plan_start: Date;
  plan_end: Date;
}

export interface BarchartTmp {
  _id: string;
  well: string;
  job: string;
  rig: string;
  plan_start: Date;
  plan_end: Date;
  info?: string;
}

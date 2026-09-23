export type JobStatus = 'queued' | 'running' | 'success' | 'warning' | 'failed' | 'interrupted';

export interface BackgroundJob {
    _id: string;
    module: string;
    ref_id: string;
    file_name: string;
    status: JobStatus;
    message: string;
    progress_current: number;
    progress_total: number;
    queued_at: string;
    started_at: string;
    finished_at: string;
    queue_position: number;
}

export interface JobListResponse {
    items: BackgroundJob[];
    active_count: number;
    failed_count: number;
}

export const ACTIVE_STATUSES: string[] = ['queued', 'running'];

export function isActiveJob(status: string): boolean {
    return ACTIVE_STATUSES.indexOf(status) >= 0;
}
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { JobStatusService } from './job-status.service';
import { BackgroundJob, isActiveJob } from './background-job';

@Component({
    selector: 'app-sync-button',
    templateUrl: './sync-button.component.html',
    styleUrls: ['./sync-button.component.scss']
})
export class SyncButtonComponent {

    jobs$: Observable<BackgroundJob[]>;
    activeCount$: Observable<number>;
    problemCount$: Observable<number>;

    private moduleLabels: { [key: string]: string } = {
        'daily-save': 'Simpan Daily',
        'daily-upload': 'Upload Daily',
        'sumur-upload': 'Upload Sumur',
    };

    constructor(public jobService: JobStatusService) {
        this.jobs$ = jobService.jobs$;
        this.activeCount$ = jobService.activeCount$;
        this.problemCount$ = jobService.problemCount$;
    }

    isActive(job: BackgroundJob): boolean {
        return isActiveJob(job.status);
    }

    trackById(index: number, job: BackgroundJob) {
        return job._id;
    }

    moduleLabel(job: BackgroundJob): string {
        return this.moduleLabels[job.module] || job.module;
    }

    iconOf(job: BackgroundJob): string {
        switch (job.status) {
            case 'queued': return 'schedule';
            case 'running': return 'autorenew';
            case 'success': return 'check_circle';
            case 'warning': return 'warning';
            case 'failed': return 'error';
            case 'interrupted': return 'report';
            default: return 'help';
        }
    }

    statusText(job: BackgroundJob): string {
        if (job.status === 'queued') {
            return job.queue_position > 0
                ? `Menunggu antrean (#${job.queue_position})`
                : 'Menunggu antrean';
        }
        return job.message;
    }

    percent(job: BackgroundJob): number {
        if (!job.progress_total) { return 0; }
        return Math.round(job.progress_current / job.progress_total * 100);
    }

    refresh(event: Event) {
        event.stopPropagation();  // supaya menu tidak tertutup
        this.jobService.refresh();
    }

    dismiss(event: Event, job: BackgroundJob) {
        event.stopPropagation();
        this.jobService.dismiss(job);
    }

    clearFinished(event: Event) {
        event.stopPropagation();
        this.jobService.dismissFinished();
    }
}
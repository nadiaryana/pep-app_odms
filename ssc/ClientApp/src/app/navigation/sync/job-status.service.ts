import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, interval, of } from 'rxjs';
import { map, switchMap, catchError, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '../../auth.service';
import { SnackbarService, SnackbarApi } from '../../snackbar.service';
import { BackgroundJob, JobListResponse, isActiveJob } from './background-job';

const POLL_INTERVAL_MS = 3000;
const LIST_URL = '/api/jobs/mine';

@Injectable({
    providedIn: 'root'
})
export class JobStatusService implements OnDestroy {

    private jobsSubject = new BehaviorSubject<BackgroundJob[]>([]);
    readonly jobs$: Observable<BackgroundJob[]> = this.jobsSubject.asObservable();

    readonly activeCount$: Observable<number> = this.jobs$.pipe(
        map(jobs => jobs.filter(j => isActiveJob(j.status)).length),
        distinctUntilChanged()
    );

    readonly problemCount$: Observable<number> = this.jobs$.pipe(
        map(jobs => jobs.filter(j => j.status === 'failed' || j.status === 'interrupted' || j.status === 'warning').length),
        distinctUntilChanged()
    );

    private pollSub: Subscription;
    private authSub: Subscription;
    private lastStatus: { [id: string]: string } = {};
    private loggedIn = false;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private snackbarService: SnackbarService,
    ) {
        this.authSub = this.authService.currentUser.subscribe(user => {
            this.loggedIn = !!user;
            if (this.loggedIn) {
                this.refresh();
            } else {
                this.stopPolling();
                this.lastStatus = {};
                this.jobsSubject.next([]);
            }
        });
    }

    ngOnDestroy() {
        this.stopPolling();
        if (this.authSub) { this.authSub.unsubscribe(); }
    }

    /** Ambil data sekali (dipanggil saat login, saat panel dibuka, atau tombol refresh). */
    refresh(): void {
        if (!this.loggedIn) { return; }
        this.fetch().subscribe(res => { if (res) { this.handle(res.items); } });
    }

    /** Dipanggil komponen setelah SaveData/UploadFiles berhasil masuk antrean. */
    track(jobId?: string): void {
        // Anggap job aktif sejak awal, supaya notifikasi tetap muncul
        // walaupun job sudah selesai sebelum polling pertama.
        if (jobId && !this.lastStatus[jobId]) {
            this.lastStatus[jobId] = 'queued';
        }
        this.refresh();
        this.startPolling();
    }

    /** Observable untuk satu job tertentu (misal ditampilkan di step "Done"). */
    job$(jobId: string): Observable<BackgroundJob> {
        return this.jobs$.pipe(map(jobs => jobs.find(j => j._id === jobId)));
    }

    dismiss(job: BackgroundJob): void {
        this.http.post(`/api/jobs/${job._id}/dismiss`, {}).subscribe(() => {
            this.jobsSubject.next(this.jobsSubject.value.filter(j => j._id !== job._id));
        });
    }

    dismissFinished(): void {
        this.http.post('/api/jobs/dismiss-finished', {}).subscribe(() => {
            this.jobsSubject.next(this.jobsSubject.value.filter(j => isActiveJob(j.status)));
        });
    }

    // ---------------------------------------------------------------

    private fetch(): Observable<JobListResponse> {
        return this.http.get<JobListResponse>(LIST_URL, { params: { hours: '24' } }).pipe(
            catchError(() => of(null))  // jangan sampai error polling mematikan stream
        );
    }

    private startPolling(): void {
        if (this.pollSub && !this.pollSub.closed) { return; }
        this.pollSub = interval(POLL_INTERVAL_MS).pipe(
            switchMap(() => this.fetch())
        ).subscribe(res => { if (res) { this.handle(res.items); } });
    }

    private stopPolling(): void {
        if (this.pollSub) {
            this.pollSub.unsubscribe();
            this.pollSub = null;
        }
    }

    private handle(items: BackgroundJob[]): void {
        items = items || [];

        items.forEach(job => {
            const prev = this.lastStatus[job._id];
            if (prev && isActiveJob(prev) && !isActiveJob(job.status)) {
                this.notify(job);
            }
            this.lastStatus[job._id] = job.status;
        });

        this.jobsSubject.next(items);

        if (items.some(j => isActiveJob(j.status))) {
            this.startPolling();
        } else {
            this.stopPolling();
        }
    }

    private notify(job: BackgroundJob): void {
        const name = job.file_name || job.module;
        let text: string;
        switch (job.status) {
            case 'success': text = `✔ ${name}: ${job.message}`; break;
            case 'warning': text = `⚠ ${name}: selesai dengan selisih data. Cek tombol Sync.`; break;
            case 'failed': text = `✖ ${name} gagal: ${job.message}`; break;
            case 'interrupted': text = `✖ ${name} terhenti (server restart). Silakan ulangi.`; break;
            default: return;
        }
        this.snackbarService.status.next(new SnackbarApi(true, text, 'dismiss'));
    }
}
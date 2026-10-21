import { Observable, EMPTY, timer, fromEvent } from 'rxjs';
import { catchError, distinctUntilChanged, exhaustMap, map, startWith, switchMap } from 'rxjs/operators';

export interface PollOptions {
    /** Jeda antar fetch dalam milidetik. */
    intervalMs: number;
    /** Hentikan polling saat tab browser tidak aktif, lalu fetch lagi saat kembali aktif. Default true. */
    pauseWhenHidden?: boolean;
}

/**
 * Panggil `request` langsung, lalu ulangi setiap `intervalMs`.
 *
 * - Request yang belum selesai tidak ditumpuk (putaran berikutnya dilewati).
 * - Error satu request hanya di-log, polling tetap jalan.
 * - Polling berhenti saat di-unsubscribe, jadi pakai `takeUntil(destroy$)` di komponen.
 *
 * Contoh:
 *   poll(() => this.http.get('/api/xxx'), { intervalMs: 30000 })
 *     .pipe(takeUntil(this.destroy$))
 *     .subscribe(res => ...);
 */
export function poll<T>(request: () => Observable<T>, options: PollOptions): Observable<T> {
    const ticks$ = timer(0, options.intervalMs).pipe(
        exhaustMap(() => request().pipe(
            catchError(err => {
                console.error('Polling request failed', err);
                return EMPTY;
            })
        ))
    );

    if (options.pauseWhenHidden === false || typeof document === 'undefined') {
        return ticks$;
    }

    return fromEvent(document, 'visibilitychange').pipe(
        startWith(null),
        map(() => !document.hidden),
        distinctUntilChanged(),
        switchMap(visible => visible ? ticks$ : EMPTY)
    );
}

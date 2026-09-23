using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ssc.Services
{
    public class QueuedHostedService : BackgroundService
    {
        private readonly ILogger<QueuedHostedService> _logger;
        private readonly IBackgroundTaskQueue _taskQueue;
        private readonly IJobTracker _jobTracker;

        private const int MAX_CONCURRENCY = 5;

        private readonly SemaphoreSlim _concurrencyLimiter = new SemaphoreSlim(MAX_CONCURRENCY, MAX_CONCURRENCY);

         public QueuedHostedService(IBackgroundTaskQueue taskQueue, IJobTracker jobTracker, ILogger<QueuedHostedService> logger)
        {
            _taskQueue = taskQueue;
            _jobTracker = jobTracker;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Queued Hosted Service is running. Max concurrency = {MaxConcurrency}", MAX_CONCURRENCY);

            // Job dari proses sebelumnya (sebelum restart) sudah hilang dari queue in-memory
            var interrupted = _jobTracker.MarkInterruptedOnStartup();
            if (interrupted > 0)
                _logger.LogWarning("{Count} background job ditandai interrupted karena restart.", interrupted);

            await BackgroundProcessing(stoppingToken);
        }

        private async Task BackgroundProcessing(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var workItem = await _taskQueue.DequeueAsync(stoppingToken);

                if (workItem == null)
                {
                    continue;
                }


                await _concurrencyLimiter.WaitAsync(stoppingToken);

                _ = Task.Run(async () =>
                {
                    try
                    {

                        await workItem(CancellationToken.None);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error occurred executing background work item.");
                    }
                    finally
                    {
                        _concurrencyLimiter.Release();
                    }
                });
            }
        }

        public override async Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Queued Hosted Service is stopping.");
            await base.StopAsync(stoppingToken);
        }
    }
}
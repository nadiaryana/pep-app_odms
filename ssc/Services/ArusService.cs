using System;
using MongoDB.Driver;
using ssc.Areas.PE.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ssc.Services
{
    public class ArusService
    {
        private readonly IMongoCollection<ArusReading> _collection;

        public ArusService(IConfiguration config)
        {
            var connectionString = config["PESumurSettings:ConnectionString"];
            var databaseName = config["PESumurSettings:DatabaseName"];
            var collectionName = config["PESumurSettings:ArusCollectionName"];

            var client = new MongoClient(connectionString);
            var db = client.GetDatabase(databaseName);
            _collection = db.GetCollection<ArusReading>(collectionName);

            // Index agar query cepat
            var indexKeys = Builders<ArusReading>.IndexKeys
                .Ascending(x => x.WellId)
                .Descending(x => x.CreatedAt);
            _collection.Indexes.CreateOne(
                new CreateIndexModel<ArusReading>(indexKeys));
        }

        public async Task InsertAsync(ArusReading data) =>
            await _collection.InsertOneAsync(data);

        public async Task<List<ArusReading>> GetByWellAsync(string wellId, int limit = 100) =>
            await _collection
                .Find(x => x.WellId == wellId)
                .SortByDescending(x => x.CreatedAt)
                .Limit(limit)
                .ToListAsync();

        public async Task<List<ArusReading>> GetByWellAndRangeAsync(
            string wellId, DateTime from, DateTime to) =>
            await _collection
                .Find(x => x.WellId == wellId
                         && x.CreatedAt >= from
                         && x.CreatedAt <= to)
                .SortByDescending(x => x.CreatedAt)
                .ToListAsync();

        public async Task<ArusReading> GetLastReadingAsync(string wellId) =>
            await _collection
                .Find(x => x.WellId == wellId)
                .SortByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();

        public async Task<List<string>> GetAllWellIdsAsync()
        {
            return await _collection
                .Distinct<string>("well_id", FilterDefinition<ArusReading>.Empty)
                .ToListAsync();
        }
    }
}
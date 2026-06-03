// using MongoDB.Driver;
// using ssc.Areas.PE.Models;
// using Microsoft.Extensions.Configuration;
// using System.Collections.Generic;
// using System.Threading.Tasks;

// namespace ssc.Services
// {
//     public class SensorService
//     {
//         private readonly IMongoCollection<SensorReading> _collection;

//         public SensorService(IConfiguration config)
//         {
//             var connectionString = config["PESumurSettings:ConnectionString"];
//             var databaseName = config["PESumurSettings:DatabaseName"];
//             var collectionName = config["PESumurSettings:SensorCollectionName"];

//             var client = new MongoClient(connectionString);
//             var db = client.GetDatabase(databaseName);
//             _collection = db.GetCollection<SensorReading>(collectionName);

//             // Index agar query cepat
//             var indexKeys = Builders<SensorReading>.IndexKeys
//                 .Ascending(x => x.WellId)
//                 .Descending(x => x.CreatedAt);
//             _collection.Indexes.CreateOne(
//                 new CreateIndexModel<SensorReading>(indexKeys));
//         }

//         public async Task InsertAsync(SensorReading data) =>
//             await _collection.InsertOneAsync(data);

//         public async Task<List<SensorReading>> GetByWellAsync(string wellId, int limit = 100) =>
//             await _collection
//                 .Find(x => x.WellId == wellId)
//                 .SortByDescending(x => x.CreatedAt)
//                 .Limit(limit)
//                 .ToListAsync();

//         public async Task<List<SensorReading>> GetByWellAndRangeAsync(
//             string wellId, DateTime from, DateTime to) =>
//             await _collection
//                 .Find(x => x.WellId == wellId
//                          && x.CreatedAt >= from
//                          && x.CreatedAt <= to)
//                 .SortByDescending(x => x.CreatedAt)
//                 .ToListAsync();

//         public async Task<SensorReading> GetLastReadingAsync(string wellId) =>
//             await _collection
//                 .Find(x => x.WellId == wellId)
//                 .SortByDescending(x => x.CreatedAt)
//                 .FirstOrDefaultAsync();

//         public async Task<List<string>> GetAllWellIdsAsync()
//         {
//             return await _collection
//                 .Distinct<string>("well_id", FilterDefinition<SensorReading>.Empty)
//                 .ToListAsync();
//         }
//     }
// }
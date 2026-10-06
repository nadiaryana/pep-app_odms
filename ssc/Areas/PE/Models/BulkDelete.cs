using System.Collections.Generic;
using MongoDB.Bson;

namespace ssc.Areas.PE.Models
{
    /// <summary>
    /// Helper untuk bulk delete.
    ///
    /// Menerima daftar id (string) dari body request, lalu mengubahnya menjadi
    /// daftar <see cref="BsonValue"/>: <c>ObjectId</c> bila id valid, atau tetap
    /// <c>string</c> bila tidak valid. Hasilnya dipakai pada
    /// <c>Builders&lt;T&gt;.Filter.In("_id", id_values)</c> sehingga hanya
    /// diperlukan 1 kali <c>DeleteMany</c> (bukan loop <c>DeleteOne</c>).
    ///
    /// Tujuan: menghindari pengiriman id lewat query string (<c>?_ids=...</c>)
    /// yang melebihi batas IIS <c>maxQueryString</c> (default 2048 byte) →
    /// HTTP 404.15 saat jumlah item banyak. Dengan body JSON tidak ada batas
    /// panjang URL.
    /// </summary>
    public static class BulkDelete
    {
        public static List<BsonValue> ToIdValues(IEnumerable<string> ids)
        {
            var values = new List<BsonValue>();
            if (ids == null)
            {
                return values;
            }

            foreach (string id in ids)
            {
                if (string.IsNullOrEmpty(id))
                {
                    continue;
                }

                if (ObjectId.TryParse(id, out ObjectId objectId))
                {
                    values.Add(new BsonObjectId(objectId));
                }
                else
                {
                    values.Add(new BsonString(id));
                }
            }

            return values;
        }
    }
}

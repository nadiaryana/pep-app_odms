using ssc.Areas.SSC.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace ssc.Areas.SSC.Services
{
    public class TicketService
    {
        private readonly IMongoCollection<Ticket> _tickets;
        private ProjectionDefinition<Ticket> _fields;

        public TicketService(ISSCDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _tickets = database.GetCollection<Ticket>(settings.TicketCollectionName);
            _fields = Builders<Ticket>.Projection
                .Include(t => t._id)
                .Include(t => t.id)
                .Include(t => t.type)
                .Include(t => t.displayId)
                .Include(t => t.summary)
                .Include(t => t.customer.fullName).Include(t => t.customer.lastName).Include(t => t.customer.department)
                .Include(t => t.customer.company.name).Include(t => t.customer.site.name)
                .Include(t => t.assignee.fullName).Include(t => t.assignee.loginId)
                .Include(t => t.priority)
                .Include(t => t.status.value).Include(t => t.status.reason)
                .Include(t => t.supportGroup.name)
                .Include(t => t.slaStatus);
        }

        public List<Ticket> Get() =>
            _tickets.Find(ticket => true).Project<Ticket>(_fields).ToList();

        public Ticket Get(string id) =>
            _tickets.Find<Ticket>(ticket => ticket._id == id).FirstOrDefault();

        public Ticket Create(Ticket ticket)
        {
            _tickets.InsertOne(ticket);
            return ticket;
        }

        public void Update(string id, Ticket ticketIn) =>
            _tickets.ReplaceOne(ticket => ticket._id == id, ticketIn);

        public void Remove(Ticket ticketIn) =>
            _tickets.DeleteOne(ticket => ticket._id == ticketIn._id);

        public void Remove(string id) =>
            _tickets.DeleteOne(ticket => ticket._id == id);
    }
}

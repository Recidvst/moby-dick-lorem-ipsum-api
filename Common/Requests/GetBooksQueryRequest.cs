
using MediatR;
using Data.Models;

namespace Common.Requests;

public class GetBooksQueryRequest : IRequest<IQueryable<BookModelWithMetaData>>
{
    public Guid? BookId { get; set; }
}

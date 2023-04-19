using Common.Requests;
using Data;
using Data.Models;
using MediatR;

namespace Common.QueryHandlers;

public class GetBooksQueryHandler : IRequestHandler<GetBooksQueryRequest, IQueryable<BookModelWithMetaData>>
{
  private readonly IContentRepository _repository;

  public GetBooksQueryHandler(IContentRepository repository)
  {
    _repository = repository;
  }

  public Task<IQueryable<BookModelWithMetaData>> Handle(GetBooksQueryRequest request, CancellationToken cancellationToken)
  {
    if (request.BookId != null)
    {
      return Task.FromResult(_repository.GetSpecificBook(x => x.Id == request.BookId));
    }
    return Task.FromResult(_repository.GetAllBooks());
  }

}

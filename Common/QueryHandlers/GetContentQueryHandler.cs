using Common.Requests;
using Data;
using Data.Models;
using MediatR;

namespace Common.QueryHandlers;

public class GetContentQueryHandler : IRequestHandler<GetContentQueryRequest, IQueryable<TextModel>>
{
  private readonly IContentRepository _repository;

  public GetContentQueryHandler(IContentRepository repository)
  {
    _repository = repository;
  }

  public Task<IQueryable<TextModel>> Handle(GetContentQueryRequest request, CancellationToken cancellationToken)
  {
    // if ID is passed, we are requesting a specific piece of content
    if (request.ContentId != null)
    {
      if (request.ContentType == "title")
      {
        return Task.FromResult(_repository.GetSpecificTitle(x => x.Id == request.ContentId));
      }
      return Task.FromResult(_repository.GetSpecificParagraph(x => x.Id == request.ContentId));
    }
    // otherwise we want a batch of content
    if (request.ContentType == "title")
    {
      return Task.FromResult(_repository.GetRandomTitles(x => x.Book.Id == request.BookId, request.count ?? 1));
    }
    return Task.FromResult(_repository.GetRandomParagraphs(x => x.Book.Id == request.BookId, request.count ?? 1));
  }

}

using Data.Models;
using Common.Requests;
using HotChocolate.Language;
using MediatR;

namespace API.Schema;

[ExtendObjectType(OperationType.Query)]
[GraphQLDescription("Query for for book details and text content")]
public class Queries
{
  /// <summary>
  /// Get book(s) details
  /// </summary>
  /// <param name="bookId">The unique ID of the book. Optional.</param>
  [UseProjection]
  [UseFiltering]
  [UseSorting]
  [GraphQLDescription("Get book(s) details - all books if no ID is passed or one book if an ID is passed")]
  public async Task<IQueryable<BookModel>> GetBooks(Guid? bookId, [Service] IMediator mediator)
  {
    return await mediator.Send(new GetBooksQueryRequest()
    {
      BookId = bookId
    });
  }

  /// <summary>
  /// Get text content (paragraphs or titles)
  /// </summary>
  /// <param name="bookId">The unique ID of the book to pull the content from. Optional.</param>
  /// <param name="contentId">The unique ID of a specific piece of content. Optional.</param>
  /// <param name="count">The number of items to pull. Optional. Defaults to 1.</param>
  /// <param name="contentType">The content type to pull. Paragraphs or Titles. Optional. Defaults to paragraphs.</param>
  [UseProjection]
  [UseFiltering]
  [UseSorting]
  [GraphQLDescription("Get text content (paragraphs or titles) - all content if no ID is passed or one piece of content if an ID is passed")]
  public async Task<IQueryable<TextModel>> GetContent(Guid? bookId, Guid? contentId, int? count, string? contentType, [Service] IMediator mediator)
  {
    return await mediator.Send(new GetContentQueryRequest()
    {
      BookId = bookId,
      ContentId = contentId,
      count = count,
      ContentType = contentType
    });
  }
}

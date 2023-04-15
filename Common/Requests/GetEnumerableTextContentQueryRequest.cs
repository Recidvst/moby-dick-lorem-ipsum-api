using MediatR;
using Data.Models;

namespace Common.Requests;

public class GetEnumerableTextContentRequest : IRequest<IQueryable<TextModel>>
{
  public string? BookTitle { get; set; }
  public Guid? BookId { get; set; }
  public int? count { get; set; } = 1;
}

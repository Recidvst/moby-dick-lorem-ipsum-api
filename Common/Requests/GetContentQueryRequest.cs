using MediatR;
using Data.Models;

namespace Common.Requests;

public class GetContentQueryRequest : IRequest<IQueryable<TextModel>>
{
  public Guid? BookId { get; set; }
  public Guid? ContentId { get; set; }
  public int? count { get; set; } = 1;
  public string? ContentType { get; set; } = "paragraph";
}

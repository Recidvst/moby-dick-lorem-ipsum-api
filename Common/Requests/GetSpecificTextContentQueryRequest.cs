using MediatR;
using Data.Models;

namespace Common.Requests;

public class GetSpecificTextContentRequest : IRequest<IQueryable<TextModel>>
{
  public string? BookTitle { get; set; }
  public Guid? BookId { get; set; }
  public Guid? TextId { get; set; }
  public int? SoftId { get; set; }
}

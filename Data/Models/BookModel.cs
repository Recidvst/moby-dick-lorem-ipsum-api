namespace Data.Models;

public class BookModel
{
  public string Title { get; set; } = null!;
  public string Author { get; set; } = null!;
  public Guid Id { get; set; } = new Guid();
  public int TotalTitleCount { get; set; }
  public int TotalParagraphCount { get; set; }
}

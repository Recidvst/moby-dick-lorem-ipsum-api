namespace Data.Models;

public class TextModel
{
  public string Content { get; set; } = null!;
  public BookModel Book { get; set; } = null!;
  public int Position { get; set; }
  public Guid Id { get; set; } = new Guid();
}

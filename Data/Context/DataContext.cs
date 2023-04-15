using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Data.Context;

public class DataContext: DbContext
{
  public DbSet<BookModel> Books =>Set<BookModel>();
  public DbSet<TitleModel> Titles => Set<TitleModel>();
  public DbSet<ParagraphModel> Paragraphs => Set<ParagraphModel>();

  public DataContext(DbContextOptions<DataContext> options): base(options)
  {
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);
    base.OnModelCreating(modelBuilder);
  }
}

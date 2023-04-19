using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data.Context;

public class DataContext: DbContext
{
  protected readonly IConfiguration Configuration;
  private static bool _created = false;

  public DataContext(IConfiguration configuration)
  {
    Configuration = configuration;
  }

  public DataContext(DbContextOptions<DataContext> options): base(options)
  {
    if (!_created)
    {
      _created = true;
      Database.EnsureDeleted();
      Database.EnsureCreated();
    }
  }

  protected override void OnConfiguring(DbContextOptionsBuilder options)
  {
    var dbConnectionString = Configuration.GetConnectionString("DefaultConnection");
    // connect to sqlite database
    options.UseSqlite(dbConnectionString);
  }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);
    base.OnModelCreating(modelBuilder);
  }

  public DbSet<BookModel> Books =>Set<BookModel>();
  public DbSet<TitleModel> Titles => Set<TitleModel>();
  public DbSet<ParagraphModel> Paragraphs => Set<ParagraphModel>();
}

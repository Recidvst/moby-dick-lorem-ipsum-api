using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Data.Models;

namespace Data.Configuration;

public class BookModelConfiguration : IEntityTypeConfiguration<BookModel>
{
  public void Configure(EntityTypeBuilder<BookModel> builder)
  {
    builder.ToTable("Books", "dbo");
    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id).IsRequired();
    builder.Property(x => x.Title).IsRequired();
    builder.Property(x => x.Author).IsRequired();
    builder.Property(x => x.TotalTitleCount).IsRequired();
    builder.Property(x => x.TotalParagraphCount).IsRequired();
  }
}

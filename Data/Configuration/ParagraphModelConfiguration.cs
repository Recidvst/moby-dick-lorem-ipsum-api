using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Data.Models;

namespace Data.Configuration;

public class ParagraphModelConfiguration : IEntityTypeConfiguration<ParagraphModel>
{
  public void Configure(EntityTypeBuilder<ParagraphModel> builder)
  {
    builder.ToTable("Paragraphs", "dbo");
    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id).IsRequired();
    builder.Property(x => x.Position).IsRequired();
    builder.Property(x => x.Content).IsRequired();
    builder.Property(x => x.Book).IsRequired();

  }
}

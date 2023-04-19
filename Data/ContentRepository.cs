using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Data.Context;
using Data.Models;

namespace Data;

public interface IContentRepository : IAsyncDisposable
{
  IQueryable<BookModelWithMetaData> GetAllBooks();
  IQueryable<BookModelWithMetaData> GetSpecificBook(Expression<Func<BookModel, bool>> predicate);
  // IQueryable<TextModel> GetAllParagraphs(Expression<Func<TextModel, bool>> predicate);
  // IQueryable<TextModel> GetAllTitles(Expression<Func<TextModel, bool>> predicate);
  IQueryable<TextModel> GetRandomParagraphs(Expression<Func<TextModel, bool>> predicate, int count);
  IQueryable<TextModel> GetRandomTitles(Expression<Func<TextModel, bool>> predicate, int count);
  IQueryable<TextModel> GetSpecificParagraph(Expression<Func<TextModel, bool>> predicate);
  IQueryable<TextModel> GetSpecificTitle(Expression<Func<TextModel, bool>> predicate);
}

public class ContentRepository : IContentRepository
{
  private readonly DataContext _context;

  public ContentRepository(DataContext context)
  {
    _context = context; // or ctxFactory.CreateDbContext();
  }

  public IQueryable<BookModelWithMetaData> GetAllBooks()
  {
    IQueryable<BookModel> books = _context.Books.AsNoTracking().OrderBy(x => x.Title);
    IQueryable<BookModelWithMetaData> booksWithMetaData = books.Select(x => new BookModelWithMetaData
    {
      Id = x.Id,
      Title = x.Title,
      Author = x.Author,
      TotalParagraphCount = _context.Paragraphs.AsNoTracking().Count(y => y.Book.Id == x.Id),
      TotalTitleCount = _context.Titles.AsNoTracking().Count(y => y.Book.Id == x.Id)
    });

    return booksWithMetaData;
  }

  public IQueryable<BookModelWithMetaData> GetSpecificBook(Expression<Func<BookModel, bool>> predicate)
  {
    BookModel book = _context.Books.AsNoTracking().Where(predicate).First();
    var bookWithMetaData = new BookModelWithMetaData
    {
      Id = book.Id,
      Title = book.Title,
      Author = book.Author,
      TotalParagraphCount = _context.Paragraphs.AsNoTracking().Count(y => y.Book.Id == book.Id),
      TotalTitleCount = _context.Titles.AsNoTracking().Count(y => y.Book.Id == book.Id)
    };

    IQueryable<BookModelWithMetaData> bookWithMetaDataList = new List<BookModelWithMetaData> { bookWithMetaData }.AsQueryable();

    return bookWithMetaDataList;
  }

  public IQueryable<TextModel> GetSpecificParagraph(Expression<Func<TextModel, bool>> predicate)
  {
    return _context.Paragraphs.AsNoTracking().Where(predicate);
  }

  public IQueryable<TextModel> GetSpecificTitle(Expression<Func<TextModel, bool>> predicate)
  {
    return _context.Titles.AsNoTracking().Where(predicate);
  }

  public IQueryable<TextModel> GetRandomParagraphs(Expression<Func<TextModel, bool>> predicate, int count)
  {
    return _context.Paragraphs.AsNoTracking().Where(predicate).OrderBy(x => Guid.NewGuid()).Take(count);
  }

  public IQueryable<TextModel> GetRandomTitles(Expression<Func<TextModel, bool>> predicate, int count)
  {
    return _context.Titles.AsNoTracking().Where(predicate).OrderBy(x => Guid.NewGuid()).Take(count);
  }

  public ValueTask DisposeAsync()
  {
    GC.SuppressFinalize(this);
    return _context.DisposeAsync();
  }
}

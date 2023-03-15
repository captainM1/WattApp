using prosumerAppBack.Models;

namespace prosumerAppBack.Helper;
public interface ITokenMaker{
    string GenerateToken(User user);
    (int?, string?) ValidateToken(string token);
}
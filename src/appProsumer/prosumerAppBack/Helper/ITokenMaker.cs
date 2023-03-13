using prosumerAppBack.Models;

namespace prosumerAppBack.Helper;
public interface ITokenMaker{
    string GenerateToken(User user);
    int? ValidateToken(string token);
}
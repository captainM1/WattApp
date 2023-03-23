using prosumerAppBack.Models;

namespace prosumerAppBack.Helper;
public interface ITokenMaker{
    string GenerateToken(User user);
    bool ValidateJwtToken(string token);
}
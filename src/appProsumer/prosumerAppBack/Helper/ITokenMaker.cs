using prosumerAppBack.Models;

namespace prosumerAppBack.Helper;
public interface ITokenMaker{
    string CreateJwt(User user);
    int? ValidateToken(string token);
}
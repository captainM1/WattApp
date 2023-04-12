using dsoAppBack.Models;

namespace dsoAppBack.Helper.TokenMaker;

public interface ITokenMaker
{
    string GenerateToken(Dispatcher dispatcher);
    bool ValidateJwtToken(string token);
}

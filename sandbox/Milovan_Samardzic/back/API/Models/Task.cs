using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Task
{
    [Key]
    public Guid TaskID { get; set; }
    public String TaskUser{ get; set; }
    public String TaskTitle{ get; set; }
    public String TaskDescription{ get; set; }
    
}
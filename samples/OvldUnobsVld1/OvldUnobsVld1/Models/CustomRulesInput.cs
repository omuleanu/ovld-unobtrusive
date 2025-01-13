using System.ComponentModel.DataAnnotations;

namespace OvldUnobtrusiveValidationSample.Models
{
    public class CustomRulesInput
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Name1 { get; set; }

        [Required]
        public int? NumA { get; set; }

        [Required]
        public int? NumB { get; set; }

        [Required]
        public int? NumC { get; set; }
    }
}

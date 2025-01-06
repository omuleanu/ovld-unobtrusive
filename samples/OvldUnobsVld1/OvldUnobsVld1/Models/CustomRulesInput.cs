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
        public int? Number { get; set; }

        [Required]
        public int? Number1 { get; set; }

        [Required]
        public int? NumberRes { get; set; }
    }
}

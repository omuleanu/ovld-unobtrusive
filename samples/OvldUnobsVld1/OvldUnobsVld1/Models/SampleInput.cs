using System.ComponentModel.DataAnnotations;

namespace OvldUnobtrusiveValidationSample.Models
{
    public class SampleInput
    {        
        [Required]
        public string Name { get; set; }

        [Required]
        public int? Number { get; set; }

        [UIHint("Textarea")]
        [MaxLength(100)]
        [MinLength(5)]
        public string Text { get; set; }        
    }
}
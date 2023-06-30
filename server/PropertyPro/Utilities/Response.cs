namespace PropertyPro.Utilities
{
    public class Response
    {
        public string Status { get; set; } = null!;

        public string Message { get; set; } = null!;

        public object? Content { get; set; }
    }
}

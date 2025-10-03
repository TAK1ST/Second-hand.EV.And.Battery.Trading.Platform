using Net.payOS.Types;

namespace PresentationLayer.DTOs;

public class CreatePaymentRequest
{
    public long OrderCode { get; set; }
    public int TotalAmount { get; set; }
    public string Currency { get; set; } = "VND";
    public string Method { get; set; }
    public string Description { get; set; }
    public DateTime? ExpiredAt { get; set; }
    public List<ItemDto> Details { get; set; } = new();
}
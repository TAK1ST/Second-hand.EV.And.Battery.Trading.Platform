﻿using System;

namespace Domain.DTOs
{
    public class CreateAddressDTO
    {
        public int UserId { get; set; }
        public string RecipientName { get; set; }
        public string Phone { get; set; }
        public string Street { get; set; }
        public string Ward { get; set; }
        public string District { get; set; }
        public string Province { get; set; }
        public bool IsDefault { get; set; }
    }
}

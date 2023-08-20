using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PropertyPro.Infrastructure.Dtos.Query
{
	public class GetLandlordsPropertiesSearchParameters
	{
		public string? Title { get; set; } 
		public string? Town { get; set; }
		public string? Country { get; set; }
		public int Page { get; set; } = 1;
    }
}

var token = Environment.GetEnvironmentVariable("DISCORD_TOKEN");
if (string.IsNullOrWhiteSpace(token)) { Console.Error.WriteLine("DISCORD_TOKEN is not configured"); return 1; }
Console.WriteLine("[Maszynka] .NET bundled bot template. Build includes Discord.Net; run with a configured token.");
return 0;

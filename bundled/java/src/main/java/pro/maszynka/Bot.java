package pro.maszynka;
public class Bot { public static void main(String[] args) { String token = System.getenv("DISCORD_TOKEN"); if (token == null || token.isBlank()) { System.err.println("DISCORD_TOKEN is not configured"); System.exit(1); } System.out.println("[Maszynka] Java bundled bot template. Build includes JDA; run with a configured token."); } }

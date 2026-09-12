package pro.maszynka;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.events.session.ReadyEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public final class Bot {
    private Bot() {}

    public static void main(String[] args) throws InterruptedException {
        String token = System.getenv("DISCORD_TOKEN");
        if (token == null || token.isBlank()) {
            System.err.println("DISCORD_TOKEN is not configured");
            System.exit(1);
        }

        JDA jda = JDABuilder.createDefault(token)
            .addEventListeners(new ListenerAdapter() {
                @Override
                public void onReady(ReadyEvent event) {
                    System.out.println("[Maszynka] Logged in as " + event.getJDA().getSelfUser().getName());
                }
            })
            .build();

        Runtime.getRuntime().addShutdownHook(new Thread(jda::shutdown));
        jda.awaitReady();

        // Keep the bundled bot process alive until Pterodactyl stops the container.
        Thread.currentThread().join();
    }
}

package pro.maszynka;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class Bot {
    private static final URI GATEWAY = URI.create("wss://gateway.discord.gg/?v=10&encoding=json");
    private static final Pattern OP_PATTERN = Pattern.compile("\\\"op\\\"\\s*:\\s*(\\d+)");
    private static final Pattern SEQ_PATTERN = Pattern.compile("\\\"s\\\"\\s*:\\s*(\\d+)");
    private static final Pattern HEARTBEAT_PATTERN = Pattern.compile("\\\"heartbeat_interval\\\"\\s*:\\s*(\\d+)");
    private static final Pattern USERNAME_PATTERN = Pattern.compile("\\\"username\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"");

    private Bot() {}

    public static void main(String[] args) throws InterruptedException {
        String token = System.getenv("DISCORD_TOKEN");
        if (token == null || token.isBlank()) {
            System.err.println("DISCORD_TOKEN is not configured");
            System.exit(1);
        }

        CountDownLatch closed = new CountDownLatch(1);
        GatewayListener listener = new GatewayListener(token, closed);

        WebSocket socket = HttpClient.newHttpClient()
            .newWebSocketBuilder()
            .buildAsync(GATEWAY, listener)
            .join();
        listener.attach(socket);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            listener.shutdown();
            try {
                socket.sendClose(WebSocket.NORMAL_CLOSURE, "Pterodactyl stop").join();
            } catch (Exception ignored) {
            }
        }));

        closed.await();
    }

    private static final class GatewayListener implements WebSocket.Listener {
        private final String token;
        private final CountDownLatch closed;
        private final StringBuilder messageBuffer = new StringBuilder();
        private final ScheduledExecutorService heartbeat = Executors.newSingleThreadScheduledExecutor();
        private volatile WebSocket socket;
        private volatile long sequence = -1;
        private volatile boolean heartbeatStarted = false;

        private GatewayListener(String token, CountDownLatch closed) {
            this.token = token;
            this.closed = closed;
        }

        void attach(WebSocket socket) {
            this.socket = socket;
        }

        @Override
        public void onOpen(WebSocket webSocket) {
            this.socket = webSocket;
            System.out.println("[Maszynka] Connected to Discord Gateway");
            webSocket.request(1);
        }

        @Override
        public CompletionStage<?> onText(WebSocket webSocket, CharSequence data, boolean last) {
            messageBuffer.append(data);
            if (last) {
                String payload = messageBuffer.toString();
                messageBuffer.setLength(0);
                handlePayload(payload);
            }
            webSocket.request(1);
            return null;
        }

        private void handlePayload(String payload) {
            Long seq = findLong(SEQ_PATTERN, payload);
            if (seq != null) {
                sequence = seq;
            }

            long op = findLong(OP_PATTERN, payload, -1L);
            if (op == 10) {
                long interval = findLong(HEARTBEAT_PATTERN, payload, 45000L);
                startHeartbeat(interval);
                identify();
                return;
            }

            if (payload.contains("\"t\":\"READY\"") || payload.contains("\"t\": \"READY\"")) {
                Matcher user = USERNAME_PATTERN.matcher(payload);
                String name = user.find() ? user.group(1) : "Discord bot";
                System.out.println("[Maszynka] Logged in as " + name);
                return;
            }

            if (op == 7 || op == 9) {
                System.err.println("[Maszynka] Discord requested reconnect/session reset");
                closeAndExit();
            }
        }

        private void startHeartbeat(long intervalMs) {
            if (heartbeatStarted) {
                return;
            }
            heartbeatStarted = true;
            heartbeat.scheduleAtFixedRate(() -> {
                WebSocket ws = socket;
                if (ws != null) {
                    String d = sequence >= 0 ? Long.toString(sequence) : "null";
                    ws.sendText("{\"op\":1,\"d\":" + d + "}", true);
                }
            }, 0, intervalMs, TimeUnit.MILLISECONDS);
        }

        private void identify() {
            WebSocket ws = socket;
            if (ws == null) {
                return;
            }
            String payload = "{\"op\":2,\"d\":{" +
                "\"token\":\"" + jsonEscape(token) + "\"," +
                "\"intents\":1," +
                "\"properties\":{" +
                "\"os\":\"linux\"," +
                "\"browser\":\"maszynka.pro\"," +
                "\"device\":\"maszynka.pro\"}" +
                "}}";
            ws.sendText(payload, true);
        }

        @Override
        public CompletionStage<?> onClose(WebSocket webSocket, int statusCode, String reason) {
            System.out.println("[Maszynka] Gateway closed: " + statusCode + " " + reason);
            shutdown();
            closed.countDown();
            return null;
        }

        @Override
        public void onError(WebSocket webSocket, Throwable error) {
            System.err.println("[Maszynka] Gateway error: " + error.getMessage());
            shutdown();
            closed.countDown();
        }

        private void closeAndExit() {
            WebSocket ws = socket;
            if (ws != null) {
                ws.sendClose(WebSocket.NORMAL_CLOSURE, "Reconnect requested");
            }
            shutdown();
            closed.countDown();
        }

        void shutdown() {
            heartbeat.shutdownNow();
        }
    }

    private static Long findLong(Pattern pattern, String input) {
        Matcher matcher = pattern.matcher(input);
        return matcher.find() ? Long.parseLong(matcher.group(1)) : null;
    }

    private static long findLong(Pattern pattern, String input, long fallback) {
        Long value = findLong(pattern, input);
        return value == null ? fallback : value;
    }

    private static String jsonEscape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}

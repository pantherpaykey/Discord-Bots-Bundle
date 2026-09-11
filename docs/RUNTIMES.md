# Runtime Versions

The project uses selectable Docker images instead of duplicating eggs per version. Images are based on the public Parkervcp Yolk naming convention used by Pterodactyl/Pelican communities and are validated by project scripts where registry access is available.

| Runtime | Recommended | Images |
|---|---|---|
| Node.js | Node.js 24 | ghcr.io/parkervcp/yolks:nodejs_24<br>ghcr.io/parkervcp/yolks:nodejs_22<br>ghcr.io/parkervcp/yolks:nodejs_20 | bundled/nodejs |
| Python | Python 3.13 | ghcr.io/parkervcp/yolks:python_3.13<br>ghcr.io/parkervcp/yolks:python_3.12<br>ghcr.io/parkervcp/yolks:python_3.11 | bundled/python |
| Java | Java 21 LTS | ghcr.io/parkervcp/yolks:java_25<br>ghcr.io/parkervcp/yolks:java_21<br>ghcr.io/parkervcp/yolks:java_17 | bundled/java |
| .NET / C# | .NET 10 | ghcr.io/parkervcp/yolks:dotnet_10<br>ghcr.io/parkervcp/yolks:dotnet_9<br>ghcr.io/parkervcp/yolks:dotnet_8 | bundled/dotnet |
| Bun | Bun latest | ghcr.io/parkervcp/yolks:bun_latest<br>ghcr.io/parkervcp/yolks:bun_1 | bundled/bun |
| Deno | Deno latest | ghcr.io/parkervcp/yolks:deno_latest<br>ghcr.io/parkervcp/yolks:deno_2 | bundled/deno |
| Go | Go 1.25 | ghcr.io/parkervcp/yolks:go_1.25<br>ghcr.io/parkervcp/yolks:go_1.24<br>ghcr.io/parkervcp/yolks:go_1.23 | bundled/go |
| Rust | Rust latest | ghcr.io/parkervcp/yolks:rust_latest<br>ghcr.io/parkervcp/yolks:rust_1 | bundled/rust |
| PHP | PHP 8.4 | ghcr.io/parkervcp/yolks:php_8.4<br>ghcr.io/parkervcp/yolks:php_8.3<br>ghcr.io/parkervcp/yolks:php_8.2 | bundled/php |

If a registry tag disappears upstream, edit only the `docker_images` map in the matching egg and rerun `npm run validate:eggs`.

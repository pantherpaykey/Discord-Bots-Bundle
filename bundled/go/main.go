package main
import ("fmt"; "os"; _ "github.com/bwmarrin/discordgo")
func main(){ if os.Getenv("DISCORD_TOKEN") == "" { fmt.Println("DISCORD_TOKEN is not configured"); os.Exit(1) }; fmt.Println("[Maszynka] Go bundled bot template. Build includes discordgo; run with a configured token.") }

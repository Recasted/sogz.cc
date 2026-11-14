// PERSONALIZE THE SITE HERE.
// Put your own images in the assets folder, then update the paths below.
// glyph is the little icon on each floating tab. x / y are where each tab starts (in % of the hero); "mobile" is used on phones.
window.ARCHIVE_CONFIG = {
  backgroundImage: "assets/default-background-eyes.png",
  backgroundPosition: "center center",
  defaultAudioTracks: [
    { title: "Einfach Sein", src: "assets/audio/default.mp3" }
  ],
 
  cards: [
    {
      title: "Games", glyph: "▞",
      subtitle: "angel.exe & its sites",
      image: "assets/card-01.jpg",
      x: 63, y: 34, rotation: -2, mobile: { x: 27, y: 73 }, theme: "pulse", audio: "",
      audioTracks: [
        { title: "baby me", src: "assets/audio/01-1-baby-me.mp3" },
        { title: "cold outside", src: "assets/audio/01-2-cold-outside.mp3" }
      ],
      // The one link on this card goes to the angel.exe community hub,
      // which links every companion site. Change the url if the hub moves.
      links: [
        { label: "angel.exe", url: "angel-exe/" }
      ]
    },
    {
      title: "Gaming", glyph: "◈", subtitle: "Steam, Roblox & more", image: "assets/card-02.jpg", x: 84, y: 24, rotation: 2, mobile: { x: 73, y: 76 }, theme: "glass", audio: "",
      audioTracks: [
        { title: "MARY JANE", src: "assets/audio/02-1-mary-jane.mp3" },
        { title: "a song about america", src: "assets/audio/02-2-a-song-about-america.mp3" }
      ],
      links: [
        { label: "minecraft", url: "https://namemc.com/profile/amphlbia.1" },
        { label: "steam", url: "https://steamcommunity.com/profiles/76561199219916593/" },
        { label: "roblox", url: "https://www.roblox.com/users/3124131039/profile" }
      ]
    },
    {
      title: "Tools", glyph: "▚", subtitle: "SogSketch, Sogcii & more", image: "assets/card-03.jpg", x: 68, y: 64, rotation: 1.5, mobile: { x: 27, y: 87 }, theme: "void", audio: "",
      audioTracks: [
        { title: "RUN", src: "assets/audio/03-1-run.mp3" },
        { title: "reminding", src: "assets/audio/03-2-reminding.mp3" }
      ],
      links: [
        { label: "SogSketch", url: "sogsketch/" },
        { label: "sogz editor", url: "sogzeditor/" },
        { label: "Sog95", url: "sog95/" },
        { label: "Sogcii", url: "sogcii/" },
        { label: "SogText", url: "sogtext/" }, { label: "SogSeek", url: "sogseek/" },
        { label: "osint", url: "https://osintforge.dev" }
      ]
    },
    {
      title: "Socials", glyph: "◉", subtitle: "Instagram, Twitch & more", image: "assets/card-04.jpg", x: 86, y: 54, rotation: -1.5, mobile: { x: 73, y: 90 }, theme: "dream", audio: "",
      audioTracks: [
        { title: "I SELL CRACK!", src: "assets/audio/04-1-i-sell-crack.mp3" },
        { title: "BEAM!", src: "assets/audio/04-2-beam.mp3" }
      ],
      links: [
        { label: "instagram", url: "https://www.instagram.com/_sogz0/" },
        { label: "instagram alt", url: "https://www.instagram.com/24.9.15.12.5/" },
        { label: "twitch", url: "https://www.twitch.tv/p62_" },
        { label: "youtube", url: "https://www.youtube.com/@ForageCR" },
        { label: "telegram", url: "https://t.me/cartelleader" }
      ]
    }
  ]
};

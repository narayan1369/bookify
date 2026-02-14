import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play, Pause, Headphones } from "lucide-react";

/* ================= TYPES ================= */
interface AudioBook {
  id: string;
  title: string;
  author: string;
  duration: string;
  coverImage: string;
  audioUrl?: string;
}

/* ================= DUMMY DATA ================= */
const audioBooks: AudioBook[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    duration: "6h 12m",
    coverImage: "/audio-books/atomic-habits.jpg",
    audioUrl: "/audio/atomic-habits.mp3",
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    duration: "5h 35m",
    coverImage: "/audio-books/deep-work.jpg",
    audioUrl: "/audio/deep-work.mp3",
  },
  {
    id: "3",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    duration: "7h 10m",
    coverImage: "/audio-books/rich-dad.jpg",
    audioUrl: "/audio/rich-dad.mp3",
  },
  {
    id: "4",
    title: "Think Like a Monk",
    author: "Jay Shetty",
    duration: "8h 02m",
    coverImage: "/audio-books/monk.jpg",
    audioUrl: "/audio/monk.mp3",
  },
];

const AudioBooksPage = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = (book: AudioBook) => {
    if (!audioRef.current) return;

    if (playingId === book.id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src = book.audioUrl || "";
      audioRef.current.play();
      setPlayingId(book.id);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-serif font-semibold text-slate-800">
          🎧 Audio Books
        </h1>
        <p className="text-slate-600 mt-1">
          Listen to your favorite books anytime, anywhere
        </p>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {audioBooks.map((book) => (
          <Card
            key={book.id}
            className="hover:shadow-lg transition"
          >
            <CardHeader className="p-0">
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-56 w-full object-cover rounded-t-lg"
              />
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <CardTitle className="text-lg">{book.title}</CardTitle>

              <p className="text-sm text-muted-foreground">
                {book.author}
              </p>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>⏱ {book.duration}</span>
                <Headphones className="h-4 w-4" />
              </div>

              <Button
                className="w-full mt-2"
                variant={playingId === book.id ? "secondary" : "default"}
                onClick={() => handlePlayPause(book)}
              >
                {playingId === book.id ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================= AUDIO ELEMENT ================= */}
      <audio ref={audioRef} />

      {/* ================= NOTE ================= */}
      <div className="text-sm text-muted-foreground">
        ⚠️ Backend connect hone ke baad real audio streaming enable ho jayegi.
      </div>
    </div>
  );
};

export default AudioBooksPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Headphones } from "lucide-react";

/* ================= TYPES ================= */
interface AudioBook {
  id: string;
  title: string;
  author: string;
  duration: string;
  coverImage: string;
  audioUrl?: string; // future backend use
}

/* ================= DUMMY DATA (BACKEND READY) ================= */
const audioBooks: AudioBook[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    duration: "6h 12m",
    coverImage: "/audio-books/atomic-habits.jpg",
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    duration: "5h 35m",
    coverImage: "/audio-books/deep-work.jpg",
  },
  {
    id: "3",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    duration: "7h 10m",
    coverImage: "/audio-books/rich-dad.jpg",
  },
  {
    id: "4",
    title: "Think Like a Monk",
    author: "Jay Shetty",
    duration: "8h 02m",
    coverImage: "/audio-books/monk.jpg",
  },
];

const AudioBooksPage = () => {
  const navigate = useNavigate();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayPause = (id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
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
            className="hover:shadow-lg transition cursor-pointer"
          >
            <CardHeader className="p-0">
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-56 w-full object-cover rounded-t-lg"
              />
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <CardTitle className="text-lg">
                {book.title}
              </CardTitle>

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
                onClick={() => handlePlayPause(book.id)}
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

      {/* ================= NOTE ================= */}
      <div className="text-sm text-muted-foreground">
        ⚠️ Audio playback backend se connect hone ke baad fully functional ho jayega.
      </div>
    </div>
  );
};

export default AudioBooksPage;

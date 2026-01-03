import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Mail, Facebook, Instagram, X, Phone, CheckCircle, Star, CircleUser } from "lucide-react"; 
import RequestBookPage from "./RequestBookPage";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false); 
  const [wishlistCount, setWishlistCount] = useState(0);
  
  // 🧠 AI RECOMMENDATION
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);

  // 🎧 AUDIO BOOKS STATE
  const [audioBooks, setSetAudioBooks] = useState<any[]>([]);

  // 🔊 AUDIO PLAYER STATE
  const [openAudioPlayer, setOpenAudioPlayer] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<{
    title: string;
    audioUrl: string;
  } | null>(null);

  /* ================= WISHLIST LOGIC ================= */
  useEffect(() => {
    const updateCount = () => {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(savedWishlist.length);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    return () => window.removeEventListener("storage", updateCount);
  }, []);

  /* ================= AI: FETCH RECOMMENDATIONS ================= */
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:7001/api/books/recommendations/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecommendedBooks(res.data || []);
      } catch (err) {
        console.error("AI recommendation error", err);
      }
    };

    fetchRecommendations();
  }, []);

  /* ================= FETCH AUDIO BOOKS ================= */
  useEffect(() => {
    const fetchAudioBooks = async () => {
      try {
        const res = await axios.get("http://localhost:7001/api/books");
        const audioOnly = res.data.filter(
          (b: any) => b.bookType === "audio"
        );
        setSetAudioBooks(audioOnly);
      } catch (err) {
        console.error("Error fetching audio books", err);
      }
    };
    fetchAudioBooks();
  }, []);

  const handleWishlistClick = () => {
    navigate("/dashboard/wishlist");
  };

  /* ================= SCROLL TO TRENDING ================= */
  const trendingSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToTrending = () => {
    trendingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ================= CLICK LOGIC (BOOKS & AUTHORS) ================= */
  const handleSearchNavigate = (searchTerm: string) => {
    navigate(`/dashboard/books?search=${encodeURIComponent(searchTerm)}`);
  };

  /* ================= TRENDING AUTO SCROLL ================= */
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const step = 1; 
    const scroll = () => {
      if (!slider) return;
      slider.scrollLeft += step;
      if (slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth)) {
        slider.scrollLeft = 0;
      }
    };

    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full bg-white relative">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="absolute right-0 top-0 h-full w-[40%] bg-[#FFDCA8]" />
        
        <div className="relative mx-auto max-w-[1500px] px-8 py-32 mt-20 flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 z-10 text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight text-slate-900">
              Where every page <br /> begins a journey…
            </h1>
            <p className="mt-8 max-w-lg text-lg text-slate-600 leading-relaxed mx-auto lg:mx-0">
              Discover a huge collection of online books curated to inspire curiosity,
              deepen knowledge, and explore timeless literature across every genre imaginable.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button size="lg" className="px-10 bg-slate-900 text-white hover:bg-slate-800 rounded-md" onClick={() => navigate("/dashboard/books")}>
                Get a book →
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-16 lg:mt-0 relative z-10">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[350px] transform transition hover:scale-105">
              <img 
                src="/books/The Old Man and the Sea.jpg" 
                className="rounded-lg w-full h-[450px] object-cover shadow-sm" 
                alt="The Old Man and the Sea" 
              />
              <div className="mt-6">
                <h3 className="text-xl font-bold text-slate-900">The Old Man and the Sea</h3>
                <p className="text-sm text-slate-500 italic mt-1">Ernest Hemingway's timeless masterpiece.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED CATEGORIES ================= */}
      <section className="mx-auto max-w-[1500px] px-8 py-24">
        <h2 className="text-4xl font-serif mb-12 text-slate-800">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { name: "Fiction & Non-Fiction", img: "Fiction & Non-Fiction.jpg" },
            { name: "Romance", img: "Romance.jpg" },
            { name: "Fantasy", img: "Fantasy.jpg" },
            { name: "Mystery", img: "Mystery.jpg" },
            { name: "Personal Growth", img: "personal growth.jpg" }
          ].map((cat) => (
            <div 
              key={cat.name} 
              onClick={() => navigate(`/dashboard/books?category=${encodeURIComponent(cat.name)}`)}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img src={`/categories/${cat.img}`} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-500" />
              <div className="relative h-full flex items-center justify-center p-4 text-center">
                <span className="text-white font-bold text-xl drop-shadow-lg group-hover:scale-105 transition transform">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= AI RECOMMENDED FOR YOU ================= */}
      {recommendedBooks.length > 0 && (
        <section className="mx-auto max-w-[1500px] px-8 py-24 border-t">
          <div className="mb-12">
            <h2 className="text-4xl font-serif text-slate-800">
              Recommended for You
            </h2>
            <p className="text-slate-500 mt-2">
              Curated based on your reading activity
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            {recommendedBooks.map((book) => (
              <div
                key={book._id}
                onClick={() => navigate(`/dashboard/books/${book._id}`)}
                className="cursor-pointer group"
              >
                <div className="overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-[280px] w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <p className="mt-4 text-sm font-bold text-slate-800 text-center group-hover:text-blue-600 transition line-clamp-2">
                  {book.title}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= TRENDING BOOKS ================= */}
      <section ref={trendingSectionRef} className="w-full px-8 py-24 border-t overflow-hidden">
        <div className="max-w-[1500px] mx-auto mb-10">
          <h2 className="text-4xl font-serif text-slate-800">Trending Books</h2>
        </div>
        
        <div ref={sliderRef} className="flex gap-6 overflow-x-hidden whitespace-nowrap py-4">
          {[
            { title: "A History of English Literature", file: "A History of English Literature – W. J. Long" },
            { title: "Crime and Punishment", file: "Crime and Punishment" },
            { title: "Doctor Zhivago", file: "Doctor Zhivago" },
            { title: "Financial Management", file: "Financial Management – I. M. Pandey" },
            { title: "Indian Economy", file: "indian Economy – Ramesh Singh" },
            { title: "Let Us C", file: "Let Us C – Yashavant Kanetkar" },
            { title: "Modern Indian History", file: "Modern Indian History – Barbara D.Metcalf and Thomas R.Metcalf" },
            { title: "One Hundred Years of Solitude", file: "One Hundred Years of Solitude" },
            { title: "Political Theory", file: "Political Theory – O. P. Gauba" },
            { title: "Psychology", file: "Psychology – Themes and Variations –Kenneth D.keith" },
            { title: "Rich Dad Poor Dad", file: "Rich Dad Poor Dad" },
            { title: "Steppenwolf", file: "Steppenwolf – Hermann Hesse" },
            { title: "Management Efficiency", file: "THE EFFECT OF AUDITING ON MANAGEMENT EFFICIENCY by munyete daniel" },
            { title: "The Good Earth", file: "The Good Earth" },
            { title: "The Grapes of Wrath", file: "The Grapes of Wrath" },
            { title: "War and Peace", file: "War and Peace" }
          ].map((book, idx) => (
            <div 
              key={idx} 
              className="inline-block min-w-[200px] group cursor-pointer"
              onClick={() => handleSearchNavigate(book.title)}
            >
              <div className="overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-all duration-500">
                <img 
                  src={`/books/${book.file}.${book.file.includes('daniel') ? 'png' : 'jpg'}`} 
                  className="h-[280px] w-full object-cover group-hover:scale-105 transition duration-500" 
                  alt={book.title} 
                />
              </div>
              <p className="mt-4 text-sm font-bold text-slate-800 group-hover:text-blue-600 transition truncate px-2 whitespace-normal line-clamp-2 text-center">
                {book.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= AUDIO BOOKS SECTION ================= */}
      <section className="mx-auto max-w-[1500px] px-8 py-24 border-t">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-serif text-slate-800">Audio Books</h2>
          <button onClick={() => navigate("/dashboard/books?category=Audio Books")} className="text-lg text-slate-600 hover:text-black font-semibold flex items-center gap-2">Show All →</button>
        </div>
        
        {audioBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            {audioBooks.map((book) => (
              <div
                key={book._id}
                className="cursor-pointer group text-center"
              >
                <div onClick={() => navigate(`/dashboard/books/${book._id}`)} className="overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition mb-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-[280px] w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <p className="text-sm font-bold text-slate-800 line-clamp-1">{book.title}</p>
                
                <Button 
                  size="sm" 
                  className="mt-3 bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentAudio({
                      title: book.title,
                      audioUrl: book.audioFile // Backend se audioFile field aana chahiye
                    });
                    setOpenAudioPlayer(true);
                  }}
                >
                  ▶ Listen
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 py-24 rounded-[40px] text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 italic text-2xl font-serif">Premium audio experiences coming soon to your library.</p>
          </div>
        )}
      </section>

      {/* ================= QUOTES BANNERS ================= */}
      <section className="mx-auto max-w-[1500px] px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-[30px] overflow-hidden shadow-2xl h-[350px] hover:scale-[1.02] transition duration-500">
            <img src="/banners/quoes1.jpg" className="w-full h-full object-cover" alt="Quote 1" />
        </div>
        <div className="rounded-[30px] overflow-hidden shadow-2xl h-[350px] hover:scale-[1.02] transition duration-500">
            <img src="/banners/quotes2.jpg" className="w-full h-full object-cover" alt="Quote 2" />
        </div>
      </section>

      {/* ================= AUTHORS SECTION ================= */}
      <section className="mx-auto max-w-[1500px] px-8 py-24 border-t">
        <h2 className="text-4xl font-serif mb-14 text-slate-800 text-center">Authors of this Month</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { name: "Robert T. Kiyosaki", img: "Robert T. Kiyosaki.jpg" },
            { name: "James D. Watson", img: "James D. Watson.jpg" },
            { name: "Albert Camus", img: "Albert Camus.jpg" },
            { name: "John Steinbeck", img: "John steinbeck.jpg" }
          ].map((author, i) => (
            <div 
              key={i} 
              onClick={() => handleSearchNavigate(author.name)}
              className="group border-none rounded-[25px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="overflow-hidden h-80">
                <img src={`/authors/${author.img}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={author.name} />
              </div>
              <div className="p-6 bg-yellow-100 font-bold text-center text-xl text-slate-800 group-hover:bg-yellow-200 transition-colors">{author.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROMO SECTION ================= */}
      <section className="w-full px-8 py-20 bg-white grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
        <div className="bg-[#6EB6B9] rounded-[30px] p-10 flex justify-between items-center min-h-[280px] shadow-xl hover:-translate-y-2 transition duration-500">
          <h3 className="text-white text-4xl font-serif font-bold leading-tight">Fresh <br /> Arrivals</h3>
          <img src="/promo/Fresh Arrivals.jpg" alt="New" className="h-56 object-contain" />
        </div>
        <div className="bg-[#1A3A6D] rounded-[30px] p-10 flex justify-between items-center min-h-[280px] shadow-xl hover:-translate-y-2 transition duration-500">
          <h3 className="text-white text-4xl font-serif font-bold leading-tight">Historical <br /> Gems</h3>
          <img src="/promo/Historical Gems.jpg" alt="History" className="h-56 object-contain" />
        </div>
        <div className="bg-[#FF8A8A] rounded-[30px] p-10 flex justify-between items-center min-h-[280px] shadow-xl hover:-translate-y-2 transition duration-500">
          <h3 className="text-white text-4xl font-serif font-bold leading-tight">Reader's <br /> Choice</h3>
          <img src="/promo/Reader's Choice.jpeg" alt="Choice" className="h-56 object-contain" />
        </div>
      </section>

      {/* ================= CUSTOMER FEEDBACK ================= */}
      <section className="mx-auto max-w-[1500px] px-8 py-24 border-t">
        <div className="mb-16">
          <h2 className="text-5xl font-serif text-slate-800">What Our Global Community Says</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 text-slate-600">
          <div className="border-none rounded-[40px] p-12 bg-slate-50 shadow-sm hover:shadow-xl transition duration-500 relative overflow-hidden group">
            <CheckCircle className="absolute -right-4 -top-4 h-24 w-24 text-slate-100 group-hover:text-yellow-200 transition" />
            <div className="flex gap-1 mb-4 text-yellow-500"><Star className="h-5 w-5 fill-current"/><Star className="h-5 w-5 fill-current"/><Star className="h-5 w-5 fill-current"/><Star className="h-5 w-5 fill-current"/><Star className="h-5 w-5 fill-current"/></div>
            <p className="text-xl leading-relaxed mb-10 italic relative z-10 font-medium text-slate-700">
              "Bookify is a masterpiece of digital curation. The way it balances a massive library with such an elegant, user-friendly interface is truly remarkable. It's not just a website; it's the ultimate sanctuary for every bibliophile."
            </p>
            <div className="flex items-center gap-6 relative z-10">
              <img src="/users/user1.jpeg" alt="Narayan" className="h-20 w-20 rounded-full object-cover ring-4 ring-yellow-400" />
              <div><p className="font-bold text-2xl text-slate-800">Narayan Tiwari</p><p className="text-lg font-medium text-slate-400">Distinguished Publishing Expert</p></div>
            </div>
          </div>
          <div className="border-none rounded-[40px] p-12 bg-slate-50 shadow-sm hover:shadow-xl transition duration-500 relative overflow-hidden group">
             <CheckCircle className="absolute -right-4 -top-4 h-24 w-24 text-slate-100 group-hover:text-yellow-200 transition" />
             <div className="flex gap-1 mb-4 text-yellow-500"><Star className="h-5 w-5 fill-current"/><Star className="h-5 w-5 fill-current"/><Star className="h-5 w-5 fill-current"/><Star className="h-5 w-5 fill-current"/><Star className="h-5 w-5 fill-current"/></div>
            <p className="text-xl leading-relaxed mb-10 italic relative z-10 font-medium text-slate-700">
              "As an author, I've seen countless platforms, but Bookify stands in a league of its own. The lightning-fast performance and the aesthetic precision of the design celebrate literature in its purest form."
            </p>
            <div className="flex items-center gap-6 relative z-10">
              <img src="/users/user2.jpeg" alt="Fyona" className="h-20 w-20 rounded-full object-cover ring-4 ring-yellow-400" />
              <div><p className="font-bold text-2xl text-slate-800">Fyona Darling</p><p className="text-lg font-medium text-slate-400">Award-Winning Indie Author</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-white border-t pt-20 pb-10">
        <div className="mx-auto max-w-[1500px] px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-slate-600">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <img src="/vite.svg" alt="logo" className="h-8 w-8" />
              <span className="text-2xl font-bold text-[#1A3A6D]">Bookify</span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-1" />
                <p className="text-sm">Galgotias University Plot No. 2, Sector 17A, Greater Noida, UP 203201</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-1" />
                <p className="text-sm">Galgotias University Plot No. 2, Sector 17A, Greater Noida, UP 203201</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-400 mt-1" />
                <p className="text-sm">narayantiwari1369@gmail.com</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                <p className="text-sm text-slate-600">7479785171</p>
              </div>
              <div className="flex gap-4 pt-4">
                <Facebook className="h-6 w-6 text-blue-600 cursor-pointer" />
                <Instagram className="h-6 w-6 text-pink-600 cursor-pointer" />
                <X className="h-6 w-6 text-black cursor-pointer" />
              </div>
            </div>
          </div>
          <div><h4 className="text-lg font-bold text-slate-800 mb-8 mt-2">Company</h4><ul className="space-y-4 text-sm font-medium"><li>About us</li><li>Jobs</li><li>Records</li><li>Supports</li></ul></div>
          <div><h4 className="text-lg font-bold text-slate-800 mb-8 mt-2">Community</h4><ul className="space-y-4 text-sm font-medium"><li>For artists</li><li>Updates</li><li>Advertising</li><li>Investor</li></ul></div>
          <div><h4 className="text-lg font-bold text-slate-800 mb-8 mt-2">Legal</h4><ul className="space-y-4 text-sm font-medium"><li>Privacy</li><li>Policy</li><li>Terms</li><li>Condition</li></ul></div>
        </div>
      </footer>

      <RequestBookPage
        open={openRequestModal}
        onClose={() => setOpenRequestModal(false)}
      />

      {/* ================= CONTACT MODAL ================= */}
      {openContactModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl relative overflow-hidden border">
            <button onClick={() => setOpenContactModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition"><X className="h-6 w-6 text-slate-500" /></button>
            <h2 className="text-4xl font-serif text-slate-800 mb-2">Get in Touch</h2>
            <div className="space-y-6 mt-8">
              <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-50 hover:bg-yellow-50 transition border border-transparent hover:border-yellow-200">
                <Mail className="h-6 w-6 text-yellow-600" />
                <div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</p><p className="text-lg font-semibold text-slate-800">narayantiwari1369@gmail.com</p></div>
              </div>
              <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-50 hover:bg-yellow-50 transition border border-transparent hover:border-yellow-200">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-600"><Phone className="h-6 w-6" /></div>
                <div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Support</p><p className="text-lg font-semibold text-slate-800">7479785171</p></div>
              </div>
              <div className="flex items-start gap-6 p-4 rounded-3xl bg-slate-50 hover:bg-yellow-50 transition border border-transparent hover:border-yellow-200">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-red-600"><MapPin className="h-6 w-6" /></div>
                <div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Main Office</p><p className="text-sm font-semibold text-slate-800 leading-tight">Galgotias University, Sector 17A, Greater Noida, UP</p></div>
              </div>
            </div>
            <Button className="w-full mt-10 py-8 rounded-full text-xl font-serif shadow-lg hover:shadow-xl transition" onClick={() => window.location.href="mailto:narayantiwari1369@gmail.com"}>Connect Now</Button>
          </div>
        </div>
      )}

      {/* ================= AUDIO PLAYER MODAL ================= */}
      {openAudioPlayer && currentAudio && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-slate-800">
                🎧 {currentAudio.title}
              </h2>
              <button onClick={() => { setOpenAudioPlayer(false); setCurrentAudio(null); }} className="p-2 hover:bg-slate-100 rounded-full transition"><X className="h-6 w-6 text-slate-500" /></button>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl mb-6">
              <audio
                src={currentAudio.audioUrl}
                controls
                autoPlay
                className="w-full"
              />
            </div>

            <Button
              className="w-full py-6 rounded-xl"
              variant="outline"
              onClick={() => {
                setOpenAudioPlayer(false);
                setCurrentAudio(null);
              }}
            >
              Close Player
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
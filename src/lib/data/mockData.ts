// Mock data that matches TMDB structure for easy swap later
export interface MockMediaItem {
  id: number;
  title: string;
  mediaType: 'movie' | 'tv';
  posterUrl: string;
  genres: string[];
  releaseYear: number;
  overview: string;
  rating: number;
}

export const mockMoviesAndShows: MockMediaItem[] = [
  {
    id: 1,
    title: "Inception",
    mediaType: "movie",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Inception",
    genres: ["Science Fiction", "Action", "Thriller"],
    releaseYear: 2010,
    overview: "A thief who steals corporate secrets through dream-sharing technology.",
    rating: 8.8
  },
  {
    id: 2,
    title: "Breaking Bad",
    mediaType: "tv",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Breaking+Bad",
    genres: ["Drama", "Crime", "Thriller"],
    releaseYear: 2008,
    overview: "A chemistry teacher turned methamphetamine producer.",
    rating: 9.5
  },
  {
    id: 3,
    title: "The Dark Knight",
    mediaType: "movie",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=The+Dark+Knight",
    genres: ["Action", "Crime", "Drama"],
    releaseYear: 2008,
    overview: "Batman faces the Joker in Gotham City.",
    rating: 9.0
  },
  {
    id: 4,
    title: "Stranger Things",
    mediaType: "tv",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Stranger+Things",
    genres: ["Science Fiction", "Horror", "Drama"],
    releaseYear: 2016,
    overview: "A group of kids uncover supernatural mysteries in their town.",
    rating: 8.7
  },
  {
    id: 5,
    title: "Interstellar",
    mediaType: "movie",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Interstellar",
    genres: ["Science Fiction", "Drama", "Adventure"],
    releaseYear: 2014,
    overview: "Explorers travel through a wormhole to save humanity.",
    rating: 8.6
  },
  {
    id: 6,
    title: "The Expanse",
    mediaType: "tv",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=The+Expanse",
    genres: ["Science Fiction", "Drama", "Mystery"],
    releaseYear: 2015,
    overview: "Political tension between Earth, Mars, and the Belt unfolds.",
    rating: 8.5
  },
  {
    id: 7,
    title: "Pulp Fiction",
    mediaType: "movie",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Pulp+Fiction",
    genres: ["Crime", "Drama"],
    releaseYear: 1994,
    overview: "Interconnected stories of Los Angeles criminals and their lives.",
    rating: 8.9
  },
  {
    id: 8,
    title: "Severance",
    mediaType: "tv",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Severance",
    genres: ["Science Fiction", "Thriller", "Mystery"],
    releaseYear: 2022,
    overview: "Employees undergo a procedure that separates work and personal memories.",
    rating: 8.7
  },
  {
    id: 9,
    title: "Spirited Away",
    mediaType: "movie",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Spirited+Away",
    genres: ["Animation", "Fantasy", "Adventure"],
    releaseYear: 2001,
    overview: "A young girl enters a magical world to save her parents.",
    rating: 8.6
  },
  {
    id: 10,
    title: "Dark",
    mediaType: "tv",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Dark",
    genres: ["Science Fiction", "Mystery", "Drama"],
    releaseYear: 2017,
    overview: "Time travel and family secrets intertwine in a German town.",
    rating: 8.8
  },
  {
    id: 11,
    title: "The Matrix",
    mediaType: "movie",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=The+Matrix",
    genres: ["Science Fiction", "Action"],
    releaseYear: 1999,
    overview: "A hacker discovers the true nature of reality.",
    rating: 8.7
  },
  {
    id: 12,
    title: "Westworld",
    mediaType: "tv",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Westworld",
    genres: ["Science Fiction", "Western", "Drama"],
    releaseYear: 2016,
    overview: "AI hosts in a theme park begin to gain consciousness.",
    rating: 8.5
  },
  {
    id: 13,
    title: "Blade Runner 2049",
    mediaType: "movie",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Blade+Runner",
    genres: ["Science Fiction", "Drama", "Mystery"],
    releaseYear: 2017,
    overview: "A blade runner uncovers a secret that could destabilize society.",
    rating: 8.0
  },
  {
    id: 14,
    title: "Arcane",
    mediaType: "tv",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Arcane",
    genres: ["Animation", "Action", "Drama"],
    releaseYear: 2021,
    overview: "Two sisters become rivals in a city divided by class conflict.",
    rating: 9.0
  },
  {
    id: 15,
    title: "Parasite",
    mediaType: "movie",
    posterUrl: "https://via.placeholder.com/300x450/1a1a2e/7cd4ff?text=Parasite",
    genres: ["Drama", "Thriller"],
    releaseYear: 2019,
    overview: "A poor family schemes to infiltrate a wealthy household.",
    rating: 8.6
  }
];

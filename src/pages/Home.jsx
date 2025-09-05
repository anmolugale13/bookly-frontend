import { useEffect, useState } from "react";
import api from "../api/axios";
import BookCard from "../components/BookCard.jsx";

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 16
};
const sidebar = {
  gridColumn: "span 3",
  background: "white",
  border: "1px solid #efe7e2",
  borderRadius: 14,
  padding: 16,
  height: "fit-content"
};
const content = { gridColumn: "span 9", display: "grid", gap: 16 };

export default function Home() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 0 });
  const [books, setBooks] = useState([]);

  useEffect(() => {
    (async () => {
      const params = { q, genre, minRating, sort, page, limit: 12 };
      const { data } = await api.get("/api/books", { params });
      setBooks(data.data);
      setMeta(data.meta);
      if (page > data.meta.pages && data.meta.pages > 0) setPage(1);
    })();
  }, [q, genre, minRating, sort, page]);

  return (
    <div style={grid}>
      <aside style={sidebar}>
        <h3 style={{ marginTop: 0, color: "#6e5b4cff" }}>Filters</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#7a6554" }}>Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title or author"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#7a6554" }}>Genre</label>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Fiction"
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#7a6554" }}>Min rating</label>
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)} style={inputStyle}>
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, color: "#7a6554" }}>Sort by</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={inputStyle}>
            <option value="newest">Newest</option>
            <option value="rating">Highest rating</option>
            <option value="reviews">Most reviewed</option>
          </select>
        </div>
      </aside>

      <section style={content}>
        <div style={{ display: "grid", gap: 16 }}>
          {books.map((b) => <BookCard key={b._id} book={b} />)}
          {books.length === 0 && <div style={{ color: "#7a6554" }}>No books found.</div>}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
          <button style={btn} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span style={{ color: "#6b625a" }}>
            Page {meta.page || 1} of {meta.pages || 1}
          </span>
          <button style={btn} disabled={meta.pages <= page} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #e6ddd6",
  borderRadius: 10,
  padding: "8px 10px",
  background: "#fcf9f7"
};
const btn = {
  background: "#8c6f5a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer"
};

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Search = () => {
  const router = useRouter();

  const [search, setSearch] = useState(null);

  const handleChange = (e) => {
    const { value } = e.target;
    const input = value.trim();
    setSearch(input);
  };

  useEffect(() => {
    if (search) {
      router.replace(`${process.env.BASE_URL}/search?q=${search}`);
    } else {
      router.replace(process.env.BASE_URL);
    }
  }, [search]);

  return (
    <span className="search-container">
      <label>검색</label>
      <input
        id="search"
        type="text"
        onChange={handleChange}
        placeholder="사람, 장소, 제목 혹은 내용"
      ></input>
      <style jsx>{`
        .search-container {
          display: grid;
          grid-template-columns: 20% 80%;
          align-items: center;
        }

        label {
          width: ;
        }

        input[type="text"] {
          border: none;
          border-bottom: 1px solid black;
        }

        ::placeholder {
          font-size: 0.8rem;
        }
      `}</style>
    </span>
  );
};

export default Search;

import Link from "next/link";

const List = ({ user, videos }) => {
  return (
    <ul>
      {videos
        ? videos.map((each, i) => (
            <Link
              href={`/videos/${each.file}?t=${user ? user.accessToken : null}`}
            >
              <li key={i}>
                <p>{each.file}</p>
                <p>내용: {each.description}</p>
                <p>
                  등장인물:{" "}
                  {each.people.map((person) => (
                    <span>{person} </span>
                  ))}
                </p>
                <p>관계: {each.relation}</p>
              </li>
            </Link>
          ))
        : ""}
      <style jsx>{`
        ul {
          width: 100%;
          display: grid;
          border-top: 1px solid black;
        }

        li {
          padding: 5px;
          list-style: none;
          cursor: pointer;
          border-bottom: 1px solid black;
        }

        li:last-child {
          border-bottom: 1px solid black;
        }

        li:hover {
          background-color: gray;
        }
      `}</style>
    </ul>
  );
};

export default List;

import Link from "next/link";

const List = ({ user, videos }) => {
  return (
    <ul>
      {videos
        ? videos.map((each, i) => (
            <Link
              key={i} // Move the key prop here
              href={`/videos/${each.video}?t=${user ? user.accessToken : null}`}
            >
              <li>
                <div>
                  <img
                    src={`${process.env.SERVER_URL}/api/thumbnail/?file=${
                      each.thumbnail
                    }&accessToken=${user ? user.accessToken : null}`}
                  />
                  <p>{each.video.replace(/_/g, " ").replace(/\.mp4$/, "")}</p>
                </div>
              </li>
            </Link>
          ))
        : ""}{" "}
      <style jsx>{`
        ul {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          border-top: 1px solid black;
        }

        li {
          padding: 5px;
          list-style: none;
          cursor: pointer;
          border-bottom: 1px solid black;
        }

        li > div > img {
          width: 100%;
        }

        li:last-child {
          border-bottom: 1px solid black;
        }

        li:hover {
          background-color: gray;
        }

        @media (max-width: 767px) {
          ul {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </ul>
  );
};

export default List;

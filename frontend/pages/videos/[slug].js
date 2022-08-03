import axios from "axios";

export const getServerSideProps = async (context) => {
  const token = context.query.t;
  const file = context.query.slug;

  const url = `${process.env.SERVER_URL}/videos/?file=${file}&accessToken=${token}`;

  try {
    const res = await axios(url);
    console.log(res.status);
  } catch (error) {
    // 비디오 요청 후 403 오류 뜨면 바로 404
    return {
      notFound: true,
    };
  }

  return {
    props: {
      video: url,
      file: file,
      accessToken: token,
    },
  };
};

export default function Videos({ video, accessToken }) {
  return (
    <div className="slug-container">
      <video controls muted controlsList="nodownload">
        <source type="video/mp4" src={video}></source>
      </video>
      <style jsx>{`
        .slug-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: black;
        }
        video {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

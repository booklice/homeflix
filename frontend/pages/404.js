import Link from "next/link";

export default function Custom404() {
  return (
    <div className="notfound-container">
      <h1>💩</h1>
      <p>새로고침 부탁드립니다.</p>
      <Link href={process.env.BASE_URL}>
        <a>뒤로</a>
      </Link>
    </div>
  );
}

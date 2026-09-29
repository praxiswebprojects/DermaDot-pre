import Link from "next/link";

export default function EnglishNotFound() {
  return (
    <main className="not-found-page" lang="en">
      <Link className="not-found-brand" href="/en" aria-label="DermaDot — home page">
        <span>Derma</span><span>Dot</span>
      </Link>
      <p className="not-found-code">404</p>
      <h1>This page could not be found.</h1>
      <p>The link may have changed or the page may no longer be available.</p>
      <Link className="button" href="/en">Back to home <span aria-hidden="true">→</span></Link>
    </main>
  );
}

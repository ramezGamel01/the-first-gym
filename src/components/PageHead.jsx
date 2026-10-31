import { SampleTag } from "./bits.jsx";

// Inner pages open on a wide photo with the page title set large over it.
// `sample` marks a placeholder photo until the gym sends its own.
export default function PageHead({ title, lede, photo, sample = true, children }) {
  return (
    <header className="page-head island">
      <div className="page-head__media" aria-hidden="true">
        <img className="graded" src={photo} alt="" fetchPriority="high" />
      </div>
      {sample && <SampleTag />}
      <div className="shell page-head__inner">
        <h1 tabIndex={-1}>{title}</h1>
        {lede && <p>{lede}</p>}
        {children}
      </div>
    </header>
  );
}

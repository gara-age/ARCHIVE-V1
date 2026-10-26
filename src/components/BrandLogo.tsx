import { assetUrl } from "../utils/assetUrl";
export default function BrandLogo({ large = false }: { large?: boolean }) {
  return <span className={`brand-lockup${large ? " brand-lockup-large" : ""}`}>
    <img src={assetUrl("/brand/v1-frame-mark.svg")} width={44} height={44} alt="" aria-hidden="true" />
    <span className="brand-name">ARCHIVE V1</span>
  </span>;
}

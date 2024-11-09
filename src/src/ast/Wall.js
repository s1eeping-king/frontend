import * as React from "react";
const SvgWall = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlSpace="preserve"
    width="210mm"
    height="297mm"
    viewBox="0 0 210 297"
    {...props}
  >
    <image
      xlinkHref="data:image/png;base64,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 SUVORK5CYII="
      width={135.467}
      height={135.467}
      x={36.777}
      y={80.963}
      preserveAspectRatio="none"
    />
  </svg>
);
export default SvgWall;
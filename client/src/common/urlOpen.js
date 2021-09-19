import { assert } from "../assert";

const externalURLNames = [
  "image1",
  "image2",
  "image3",
  "image4",
  "image5",
  "image6",
  "image7",
  "image8",
  "image9",
];

export function isValidURLName(urlName) {
  return externalURLNames.includes(urlName);
}

export function openURL(urlName) {
  assert(externalURLNames.includes(urlName), "urlname");

  switch (urlName) {
    case "image1":
      window.open("https://standlaid.github.io/portfolio/OE/M1988.html");
      break;
    case "image2":
      window.open("https://standlaid.github.io/portfolio/OE/Ms.html");
      break;
    case "image3":
      window.open("https://standlaid.github.io/portfolio/OE/M.html");
      break;
    case "image4":
      window.open("https://standlaid.github.io/portfolio/OE/SS.html");
      break;
    case "image5":
      window.open("https://standlaid.github.io/portfolio/OE/C01.html");
      break;
    case "image6":
      window.open("https://standlaid.github.io/portfolio/OE/C02.html");
      break;
    case "image7":
      window.open("https://standlaid.github.io/portfolio/OE/C03.html");
      break;
    case "image8":
      window.open("https://standlaid.github.io/portfolio/OE/C04.html");
      break;
    case "image9":
      window.open("https://standlaid.github.io/portfolio/OE/C05.html");
      break;
    default:
      throw new Error("invalid url name");
  }
}

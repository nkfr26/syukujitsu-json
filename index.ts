import { mkdirSync, writeFileSync } from "node:fs";

const formatDate = (date: Date) =>
  date
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", "-");

(async () => {
  const response = await fetch(
    "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv",
  );
  const arrayBuffer = await response.arrayBuffer();

  const decoder = new TextDecoder("shift-jis");
  const csvText = decoder.decode(arrayBuffer);

  const currentYear = new Date().getFullYear();
  const targetYears = [currentYear.toString(), (currentYear + 1).toString()];

  const syukujitsu = Object.fromEntries(
    csvText
      .split("\r")
      .map((line) => line.split(","))
      .map(([date, name]) => [formatDate(new Date(date || "")), name])
      .filter(([date]) => targetYears.some((year) => date?.startsWith(year))),
  );

  mkdirSync("docs", { recursive: true });
  writeFileSync("docs/syukujitsu.json", JSON.stringify(syukujitsu, null, 2));
})();

import { mkdirSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

(async () => {
  const response = await fetch(
    "https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv",
  );
  const arrayBuffer = await response.arrayBuffer();

  const decoder = new TextDecoder("shift-jis");
  const csvText = decoder.decode(arrayBuffer);
  const records: Record<string, string>[] = parse(csvText, {
    columns: true,
  });

  const syukujitsu: Record<string, string> = {};
  const currentYear = new Date().getFullYear();
  const targetYears = [currentYear.toString(), (currentYear + 1).toString()];

  for (const record of records) {
    // 国民の祝日・休日月日,国民の祝日・休日名称
    const [dateKey, nameKey] = Object.keys(record);

    if (!dateKey || !nameKey) continue;
    const date = record[dateKey];
    const name = record[nameKey];
    if (date && name && targetYears.some((year) => date.startsWith(year))) {
      syukujitsu[date] = name;
    }
  }

  mkdirSync("docs", { recursive: true });
  writeFileSync("docs/syukujitsu.json", JSON.stringify(syukujitsu, null, 2));
})();

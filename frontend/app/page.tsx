import HomePage from "../components/HomePage";
import { getSurahList } from "../utils/api";

export default async function Page() {
  const surahs = await getSurahList();

  return <HomePage surahs={surahs} />;
}

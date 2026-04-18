import { notFound } from "next/navigation";
import SurahReader from "../../../components/SurahReader";
import { getSurahDetails } from "../../../utils/api";

export default async function Page({ params }) {
  const { id } = await params;
  const surah = await getSurahDetails(id);

  if (!surah) {
    notFound();
  }

  return <SurahReader surah={surah} />;
}

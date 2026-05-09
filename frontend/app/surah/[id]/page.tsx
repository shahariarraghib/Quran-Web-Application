import { notFound } from "next/navigation";
import SurahReader from "../../../components/SurahReader";
import { getSurahDetails, getSurahList } from "../../../utils/api";

export async function generateStaticParams() {
  const surahs = await getSurahList();
  return surahs.map((surah) => ({ id: String(surah.number) }));
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const surah = await getSurahDetails(id);

  if (!surah) {
    notFound();
  }

  return <SurahReader surah={surah} />;
}

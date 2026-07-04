import { UnsubscribeClient } from "../../components/newsletter/UnsubscribeClient";

type UnsubscribePageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const resolvedSearchParams = await searchParams;
  const tokenParam = resolvedSearchParams.token;

  const token = Array.isArray(tokenParam)
    ? tokenParam[0]?.trim() ?? ""
    : tokenParam?.trim() ?? "";

  return <UnsubscribeClient token={token} />;
}
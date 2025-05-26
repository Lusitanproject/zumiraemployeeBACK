import { getResults } from "./actions";
import { Feedback } from "./components/feedback";
import { NoData } from "./components/no-data";
import { Processing } from "./components/processing";

export default async function Devolutiva({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const results = (await getResults(id)).data?.items;

  let content;
  if (!results?.length) {
    content = <NoData selfMonitoringBlockId={id} />;
  } else if (results[0].feedback) {
    content = <Feedback data={results[0]} />;
  } else {
    content = <Processing />;
  }

  return <div className="flex size-full py-10">{content}</div>;
}

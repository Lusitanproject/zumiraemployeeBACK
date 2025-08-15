import { getResult } from "./actions";
import { Feedback } from "./components/feedback";
import { NoData } from "./components/no-data";
import { Processing } from "./components/processing";

export default async function Devolutiva({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const result = (await getResult(assessmentId)).data;

  let content;
  if (!result) {
    content = <NoData assessmentId={assessmentId} />;
  } else if (result.feedback) {
    content = <Feedback data={result} />;
  } else {
    content = <Processing />;
  }

  return <div className="flex size-full py-10">{content}</div>;
}

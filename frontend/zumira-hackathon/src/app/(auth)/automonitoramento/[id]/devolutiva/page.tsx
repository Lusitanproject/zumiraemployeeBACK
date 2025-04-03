import { getFeedback } from "./actions";
import { Feedback } from "./components/feedback";
import { NoData } from "./components/no-data";
import { Processing } from "./components/processing";

export default async function Devolutiva({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const feedback = (await getFeedback(id)).data;

  let content;
  if (feedback?.items.length) {
    content = (
      <Feedback
        key={feedback.items[0].id}
        title={feedback.items[0].assessment.title}
        subtitle={feedback.items[0].assessment.psychologicalDimensions.map((d) => d.name).join(", ")}
        text={feedback.items[0].text}
        createdAt={feedback.items[0].createdAt}
      />
    );
  } else if (feedback?.processing.length) {
    content = <Processing />;
  } else {
    content = <NoData selfMonitoringBlockId={id} />;
  }

  return <div className="flex size-full py-10">{content}</div>;
}

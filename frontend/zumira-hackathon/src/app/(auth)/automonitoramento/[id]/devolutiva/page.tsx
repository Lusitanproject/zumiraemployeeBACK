import { getFeedback } from "./actions";
import { Feedback } from "./components/feedback";
import { NoData } from "./components/no-data";

export default async function Devolutiva({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const feedback = (await getFeedback(id)).data;

    const content = feedback ? (
        <Feedback
            title={feedback.selfMonitoringBlock.title}
            subtitle={feedback.selfMonitoringBlock.pyschologicalDimensions.map((d) => d.name).join(", ")}
            text={feedback.text}
        />
    ) : (
        <NoData selfMonitoringBlockId={id} />
    );

    return <div className="flex size-full py-10">{content}</div>;
}

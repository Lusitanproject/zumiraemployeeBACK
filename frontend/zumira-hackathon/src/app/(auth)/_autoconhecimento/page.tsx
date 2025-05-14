import { getMonitoringBlocks } from "./actions";
import { MonitoringBlocksList } from "./components/monitoring-blocks-list";

export default async function Autoconhecimento() {
  const result = await getMonitoringBlocks();

  return (
    <div className="flex flex-col w-full py-4">
      <MonitoringBlocksList data={result.data} />
    </div>
  );
}

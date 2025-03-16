import { getMonitoringBlocks } from "./actions";
import { BlocksList, Header } from "./components";

export default async function Automonitoramento() {
  const result = await getMonitoringBlocks()

  return (
    <div className="flex flex-col w-full">
      <Header />
      <BlocksList data={result.data} />
    </div>
  )
}

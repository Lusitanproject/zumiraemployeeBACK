import { MonitoringBlock } from "../definitions"
import { Card } from "./card"

type MonitoringBlocksListProps = {
  data: MonitoringBlock[]
}

export function MonitoringBlocksList({ data }: MonitoringBlocksListProps) {
  if (!data) {
    return <></>
  }

  return (
    <div className="flex flex-col">
      <div className="relative border-b border-gray-200 mb-[35px] h-[18px]">
        <span className="absolute top-0 left-0 w-fit pr-3 flex items-center text-lg font-medium text-gray-500 bg-white">Avaliações</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {data.map(item => (
          <Card
            key={item.id}
            id={item.id}
            title={item.title}
            summary={item.summary}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  )
}

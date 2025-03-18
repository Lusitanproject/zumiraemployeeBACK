import { User } from "../definitions"
import { UserCard } from "./user-card"

type UserListProps = {
  data: User[]
}

export function UserList({ data }: UserListProps) {
  if (!data) {
    return <></>
  }

  return (
    <div className="flex flex-col py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {data.map(item => (
          <UserCard
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </div>
  )
}

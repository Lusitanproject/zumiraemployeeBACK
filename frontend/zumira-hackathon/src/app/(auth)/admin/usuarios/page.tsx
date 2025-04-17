import { getUsers } from "./actions";
import { Header, UserList } from "./components";

export default async function Usuarios() {
  const result = await getUsers();

  return (
    <div className="flex flex-col w-full">
      <Header />
      <UserList data={result} />
    </div>
  );
}

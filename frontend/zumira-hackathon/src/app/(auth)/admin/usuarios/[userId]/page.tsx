import { getCompanies, getRoles, getUserData } from "./actions"
import { UserForm } from "./form"

export default async function ManageUser({
  params
}: { params: Promise<{ userId: string }> }) {
  const id = (await params).userId
  const user = await getUserData(id === "novo" ? null : id)
  const companies = await getCompanies()
  const roles = await getRoles()

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <h3 className="font-bold text-2xl text-gray-700">{id === "novo" ? "Novo " : "Editar "}usuário</h3>
      </div>
      <UserForm
        data={user}
        companies={companies}
        roles={roles}
      />
    </div>
  )
}

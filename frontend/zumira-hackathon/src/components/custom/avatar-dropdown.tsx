"use client"
import { logout } from "@/app/_lib/auth"

type AvatarDropdownProps = {
  open: boolean
  onClose: () => void
}

export function AvatarDropdown({ open, onClose }: AvatarDropdownProps) {
  if (!open) {
    return <></>
  }

  return (
    <>
      <div className="inset-0 fixed bg-gray-500/60 z-40" onClick={onClose}>
      </div>
      <div className="absolute right-0 top-14 shadow-2xl bg-white border border-gray-200 w-[20.5rem] md:w-28 py-1 z-40 rounded-lg overflow-hidden">
        <button
          className="w-full px-3 py-2 text-right bg-white hover:bg-error-100 text-sm font-medium text-error-600 flex items-center"
          onClick={async () => {
            await logout()
          }}
        >
          <span className="">Sair</span>
        </button>
      </div>
    </>
  )
}

import Image from "next/image";

export function Avatar() {
  // TODO: criar método para buscar dados do usuário e exibir no componente

  return (
    <div className="overflow-hidden rounded-full w-12 h-12 md:w-11 md:h-11 md:border-2 md:border-white md:shadow-lg">
      <Image src="https://fastly.picsum.photos/id/183/2316/1544.jpg?hmac=908ZBWKqGdL9kio38tCq2ViwMm3DjLUtkjU_6SWNa9k" alt="" width={48} height={48} className="aspect-square" />
    </div>
  )
}

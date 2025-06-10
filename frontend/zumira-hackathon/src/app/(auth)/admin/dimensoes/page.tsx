import { getDimensions } from "./actions";
import { DimensionList, Header } from "./components";

export default async function Dimensoes() {
  const result = await getDimensions();

  return (
    <div className="flex flex-col w-full">
      <Header />
      <DimensionList data={result} />
    </div>
  );
}

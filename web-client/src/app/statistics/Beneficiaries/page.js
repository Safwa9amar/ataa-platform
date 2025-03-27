import RenderCards from "./RenderCards";

export const metadata = {
  title: "احصائيات المستفيدين",
};

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <RenderCards />
    </div>
  );
}

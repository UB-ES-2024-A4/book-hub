import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-blue-950 to-blue-200">
      <Header />
      <h1 className="text-4xl font-bold">HOME</h1>
    </div>
  );
}
import { Product } from "@/types/Product";
import Header from "./_components/Header";
import Products from "./_components/Products";
import Slider from "./_components/Slider";
import ForYou from "./_components/ForYou";
import Image from "next/image";
import Footer from "./_components/Footer";
import Categories from "./_components/Categories";
import ExpiresOffert from "./_components/ExpiresOffert";
export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/products`, {
    method: "GET",
    cache: "no-cache"
  })
  const produtos = await response.json() as Product[]
  return (
    <>
      <Header />
      <Slider />
      <main>
        <div className="container-width mt-[4rem]">
          <ExpiresOffert/>
          <Products products={produtos.filter((p)=> p.tags?.includes("oferta-do-dia"))} />
        </div>
        <Categories/>
        <ForYou products={produtos} />
        <section className="h-[50vh] relative">
          <div className="absolute top-2/4 -translate-y-2/4 z-[1] right-2/4 translate-x-2/4 w-full ">
          <h1 className="text-[4rem] lg:text-[8rem] font-semibold italic max-w-[80%] lg:max-w-[50%] mx-auto">
            &quot;Moda que vai muito além do estilo.&quot;
          </h1>
          </div>
          <Image src={"/banner-4.webp"} alt="Banner" width={2000} height={2000} className="w-full h-full object-cover" />
          <div className="inset-0 absolute left-0 top-0 h-full w-full bg-zinc-900/50"></div>
        </section>
      </main>
      <Footer />
    </>
  );
}

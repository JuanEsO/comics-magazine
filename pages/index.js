import Head from 'next/head'
import { Container, Card, Row, Text } from "@nextui-org/react";
import { Layout } from "components/Layout";
import fs from "fs/promises";
import Link from 'next/link';
import Image from 'next/image';


export default function Home({ comics }) {
  return (
    <div >
      <Head>
        <title>xkcd - Comic for developers</title>
        <meta name="description" content="Comics for developers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <main>
          <h2 className='text-3xl font-bold text-center mb-10'>Lastest Comics</h2>
          <section className='grid grid-cols-1 gap-2 max-w-md m-auto sm:grid-cols-2 md:grid-cols-3'>
          {
            comics.map(comic => (
              <Link href={`/comic/${comic.id}`} key={comic.id} className={"pb-4 m-auto mb-4"}>
                <h3 className='font-bold text-sm text-center pb-2'>{comic.title}</h3>
                <Image width="300" height="300" src={comic.img} alt={comic.alt} />
              </Link>
            ))
          }
          </section>
        </main>
      </Layout>
    </div>
  )
}

export async function getStaticProps(context) {
  const files = await fs.readdir("./comics");
  const lastestComics = files.slice(-8, files.length)
  
  const promisesReadFiles = lastestComics.map(async (file) => {
    const data = await fs.readFile(`./comics/${file}`, "utf-8");
    return JSON.parse(data);
  });
  const latestComics = await Promise.all(promisesReadFiles);
  return {
    props: {
      comics: latestComics,
    }
  }
}


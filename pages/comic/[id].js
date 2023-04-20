import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { readFile, stat, readdir } from 'fs/promises';
import Link from 'next/link';
import { basename } from 'path';
import { Layout } from 'components/Layout';

const Comic = ({ id, img, alt, title, width, height, hasPreviuos, hasNext, prevId, nextId }) => {
    return (
        <div>
            <Head>
                <title>xkcd - Comic for developers</title>
                <meta name="description" content="Comics for developers" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Layout>
                <main>
                    <section className='max-w-lg m-auto'>
                        <h1 className='font-bold text-center mb-4 text-xl'>{title}</h1>
                        <div className='max-w-xs m-auto mb-4'>
                        <Image
                            width={width}
                            height={height}
                            src={img}
                            alt={alt}
                            layout="responsive"
                        />
                        </div>
                        <p>{alt}</p>

                        {/* Create pagination with nextId and prevId if available */}
                        <div className='flex justify-between mt-5'>
                            {hasPreviuos && (
                                <Link href={`/comic/${prevId}`} className="text-gray-600">
                                ⬅️ Previous
                                </Link>
                            )}
                            {hasNext && (
                                <Link href={`/comic/${nextId}`} className="text-gray-600">
                                    Next ➡️
                                </Link>
                            )}
                        </div>
                    </section>
                </main>
            </Layout>
        </div>
    );
};

export async function getStaticPaths() {
    const files = await readdir("./comics", "utf-8");
    const paths = files.map((file) => {
        const id = basename(file, ".json");
        return {
            params: { id },
        };
    });

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const { id } = params;
    const content = await readFile(`./comics/${id}.json`, "utf-8");
    const comic = JSON.parse(content);

    const idNumber = +id;
    const prevId = idNumber - 1;
    const nextId = idNumber + 1;

    const [prevResults, nextResults] = await Promise.allSettled([
        stat(`./comics/${prevId}.json`),
        stat(`./comics/${nextId}.json`),
    ]);

    const hasPreviuos = prevResults.status === 'fulfilled';
    const hasNext = nextResults.status === 'fulfilled';

    return {
        props: {
            ...comic,
            hasPreviuos,
            hasNext,
            prevId,
            nextId,
        }
    }
}

export default Comic;
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout ({ children }) {
    return (
        <div>
            <Header />
            <main className='max-w-md m-auto'>
                {children}
            </main>
            <Footer />
        </div>
    );
}
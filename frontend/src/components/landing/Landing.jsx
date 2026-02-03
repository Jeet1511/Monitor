import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import Hero from './Hero';
import Features from './Features';
import About from './About';
import CTA from './CTA';

const Landing = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <About />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;

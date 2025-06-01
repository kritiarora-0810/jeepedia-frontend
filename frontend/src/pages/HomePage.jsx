import Navbar from '../components/Navbar/Navbar';
import Carousel from '../components/carouselll/App';
import Footer from '../components/Footer/Footer';
import AdmissionBanner from '../components/AdmissionBanner/AdmissionBanner';
import Testimonial from '../components/Testimonial/Testimonial';
import CollegeCards from '../components/CollegeCards/CollegeCards';
import KeyFeatures from '../components/KeyFeatures';

function HomePage() {
  return (
    <>
    <Navbar />
    <Carousel />
    <KeyFeatures />
    <CollegeCards />
    <AdmissionBanner />
    <Testimonial />
    <Footer />
    </>
  );
}

export default HomePage;
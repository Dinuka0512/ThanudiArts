import NavBar from "../componens/navBar.tsx";
import Logo from "../assets/l3.png"
// import profilePic from "../assets/profile.jpg"; // your profile image

export default function About() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <NavBar />

            {/* Hero / Intro Section */}
            <section className="bg-gray-600 text-white py-15 text-center flex flex-col justify-center items-center">
                <img src={Logo} alt="Thanudi Arts Logo" className="w-40"/>
                <h1 className="text-4xl font-bold mb-4">About Thanudi Arts</h1>
                <p className="max-w-xl mx-auto text-lg">
                    Discover the world of creativity and imagination through unique hand-drawn and digital art.
                </p>
            </section>

            {/* About / Bio Section */}
            <section className="py-16 px-5 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                    <img
                        src={""}
                        alt="Thanudi Arts"
                        className="rounded-lg shadow-lg w-64 h-64 object-cover"
                    />
                </div>

                {/* Bio Text */}
                <div>
                    <h2 className="text-3xl font-semibold mb-4">Hello, I’m Thanudi!</h2>
                    <p className="text-gray-700 mb-4">
                        I’m an artist passionate about creating artwork that tells stories and inspires imagination. I work with both digital and hand-drawn mediums, blending traditional techniques with modern creativity.
                    </p>
                    <p className="text-gray-700">
                        My goal is to bring unique designs and personalized art experiences to everyone. Whether it’s a gallery piece, a custom commission, or an item for sale, every artwork reflects my love for creativity and detail.
                    </p>
                </div>
            </section>
        </div>
    );
}

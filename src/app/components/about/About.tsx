import Image from "next/image";
import Link from "next/link";

const About = () => {
    return (
        <section
            id="about"
            className='min-h-screen mt-14 md:mt-40 py-16 bg-gray-100 dark:bg-slate-900 transition-theme'
        >
            <p className=' text-sm text-center font-medium px-2 py-1 mt-5 rounded-full bg-gray-200 max-w-[150px] mx-auto dark:bg-slate-700 transition-theme'>
                About me
            </p>
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-x-20 mt-10 px-5 md:px-20 md:mx-auto md:max-w-[1500px]">
                <div className="container relative h-[300px] md:h-[500px] w-[250px]  md:w-1/2 lg:w-3/12 px-3 mx-auto justify-center">
                    <Image
                        src="/assets/images/pic.jpg"
                        alt="profile-image"
                        fill
                        className="rounded-sm object-cover md:object-fill"
                    />
                    <div className="absolute top-12 -bottom-6 -left-6 md:-left-12 w-4 md:w-9   bg-gray-200 dark:bg-slate-700 transition-theme" />{/* left */}
                    <div className="absolute -bottom-6 md:-bottom-12 -left-4 md:-left-12 h-4 md:h-9 right-12 bg-gray-200 dark:bg-slate-700 transition-theme" /> {/* bottom */}
                </div>

                <div className="md:w-1/2">
                    <h2 className="text-xl md:text-3xl font-bold mb-5 mt-20 md:mt-0">Curious about me? Here you have it:</h2>
                    <p className="dark:text-gray-300">I&apos;m a passionate, <span className=" underline">self-proclaimed frontend developer</span> who
                        specialized in front end  development (React.js). I am very enthusiatic about bringing the technical and visual aspects
                        of digital product to life. User experience, and writing clear, readable, highly performant code matters to me.
                    </p>
                    <br />
                    <p className="dark:text-gray-300">
                        I began my curiosity about programming when I was in my 2nd year in college in 2022. During that time, I had basic knowledge about
                        programming, my focus was writing Java code mostly on terminal. After learning about GUIs (Graphical User Interfaces), that&apos;s where I enjoyed 
                        programming and built my very first interactive solo project as a challenge to myself. After that, I decided to learn web development from the start to expand my knowledge. Since then, I&apos;ve
                        continued to grow and evolve as an aspiring developer, taking on new challenges and learning the latest technologies along the way. Now,
                        I&apos;m building cutting edge web applications, mostly personal projects using modern technologies such as Next.js, TypeScript, Tailwind CSS, Firebase, and much more.
                    </p>
                    <br />
                    <p className="dark:text-gray-300">
                        When I&apos;m not in developer-mode, you can find me doing things I like such as watching anime and movies, or playing computer games.
                        You can add me on  <Link href="https://www.facebook.com/td.nano" target="_blank">
                            <span className="underline">Facebook</span>
                        </Link> or you can follow me on <Link href="https://github.com/pixcs" target="_blank">
                            <span className="underline">GitHub</span>
                        </Link>.
                    </p>
                    <br />
                    <p className="dark:text-gray-300">Finally, some quick bits about me.</p>
                    <br />
                    <ul className="list-disc ml-5 grid  md:grid-cols-2 leading-7 md:leading-10 dark:text-gray-300">
                        <li>B.S. in Computer Science</li>
                        <li>Avid Learner</li>
                        <li>Aspiring full stack developer</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default About;
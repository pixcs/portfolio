import { TbError404 } from "react-icons/tb";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className='mobile-height md:desktop-height'>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-y-4 w-full">
        <div className="flex items-center justify-center gap-5 md:gap-10">
          <TbError404 size={100} />
          <div className="font-bold">|</div>
          <h1 className="text-xl md:text-5xl font-medium"> Page not found</h1>
        </div>
        <Link
          href="/"
          className="underline font-medium text-xl md:text-3xl active:opacity-50"
        >
          <IoMdArrowRoundBack className="inline-block mr-3" />
          Back to home page
        </Link>
      </div>
    </div>
  )
}

export default NotFound;
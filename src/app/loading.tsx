import { SiContentstack } from "react-icons/si";


const Loading = () => {
  return (
    <div className='mobile-height md:desktop-height relative animate-pulse'>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-10">
        <SiContentstack size={100} className="rotate-effect" />
        <h1 className='text-xl md:text-5xl font-bold'>Please wait...</h1>
      </div>
    </div>
  )
}

export default Loading;
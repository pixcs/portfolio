import { SiContentstack } from "react-icons/si";

const Loading = () => {
  return (
    <div className='mobile-height md:desktop-height relative'>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-6">
        <SiContentstack
          size={100}
          className="rotate-effect"
          style={{
            filter: "drop-shadow(0 0 14px rgba(124,111,224,0.5))",
          }}
        />
        <h1
          className="text-xl md:text-4xl font-medium tracking-tight text-gray-700"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Please wait…
        </h1>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@500&display=swap');
      `}</style>
    </div>
  )
}

export default Loading;
export default function Home() {
  return (
      <main className="flex justify-center">
        <div className="h-screen w-[600px]">
          <div className="flex flex-row">
            <div className="flex justify-between items-center w-full h-[50px] border-b-[1px] border-r-[1px] border-l-[1px] border-slate-700">
              <p className="text-gray-300 font-semibold text-xl ml-5 p-1 border-b-[1px] border-pink-300">Home</p>
              <p className="text-gray-300 font-semibold text-xl mr-5 p-1">Following</p>
            </div>
          </div>
          {/* Main scrolling menu */}
          <div className="flex flex-col border-l-[1px] border-r-[1px] border-slate-700 h-screen">
            
          </div>
        </div>
      </main>
  );
}

export default function Home() {
  return (
    <div className='font-sans flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-8'>
      <main className='flex flex-col items-center gap-8'>
        <span className='text-7xl animate-bounce'>🚧</span>
        <h1 className='text-4xl sm:text-5xl font-extrabold text-center text-pink-600 drop-shadow-lg'>
          Oops! This site is still hatching 🥚
        </h1>
        <p className='text-lg sm:text-xl text-center text-gray-700 max-w-xl'>
          We’re busy building something egg-citing!<br />
          Check back soon to see what’s cracking. 🐣
        </p>
        <div className='flex gap-2 mt-4'>
          <span className='w-3 h-3 bg-yellow-400 rounded-full animate-pulse'></span>
          <span className='w-3 h-3 bg-pink-400 rounded-full animate-pulse [animation-delay:0.2s]'></span>
          <span className='w-3 h-3 bg-blue-400 rounded-full animate-pulse [animation-delay:0.4s]'></span>
        </div>
      </main>
      <footer className='mt-16 text-gray-500 text-sm'>
        &copy; {new Date().getFullYear()} Steven Schrader. All yolks reserved.
      </footer>
    </div>
  );
}

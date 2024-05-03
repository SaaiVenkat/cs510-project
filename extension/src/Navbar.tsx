const Navbar = ({ token }) => {


  return (
    <div className="flex justify-between items-center p-2 sm:p-4 bg-white">
      <h1 className="text-lg sm:text-xl font-bold font-marker">Intellimark</h1>
      {token ? (
        <div className="flex justify-center items-center">
          <span className="inline-block h-3 w-3 bg-green-500 rounded-full"></span>
          <p className="ml-2">Online</p>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <span className="inline-block h-3 w-3 bg-gray-500 rounded-full"></span>
          <p className="ml-2">Offline</p>
        </div>
      )}
    </div>
  );
}

export default Navbar;
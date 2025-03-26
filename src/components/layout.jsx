import logo from '../assets/logo.svg';

export default function Layout({ children }) {
    return (
      <div className="fixed inset-0 bg-white p-4 sm:p-4 overflow-hidden">
        <div className="h-full w-full bg-gray-50 rounded-xl flex flex-col">
          <div className="p-4 sm:p-6">
            <img src={logo} alt="Logo" className="h-10 mb-6" />
          </div>
          <div className="flex-1 flex justify-center items-center">
            {children}
          </div>
        </div>
      </div>
    );
  }
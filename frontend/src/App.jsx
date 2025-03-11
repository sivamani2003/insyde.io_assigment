import { useState } from "react";
import FileUpload from "./components/FileUpload.jsx";
import ModelViewer from "./components/ModelViewer.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (filename, originalName) => {
    setFile(`http://127.0.0.1:5000/files/${filename}`);
    setFileName(originalName || filename);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-medium text-gray-800 mb-4">
                Upload Model
              </h2>
              <FileUpload onUpload={handleFileUpload} />
            </div>

            {file && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">
                  Model Info
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      File Name
                    </p>
                    <p className="text-sm text-gray-800">{fileName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Controls
                    </p>
                    <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
                      <li>Left click: Rotate</li>
                      <li>Right click: Pan</li>
                      <li>Scroll: Zoom</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {file ? (
              <div className="bg-white rounded-lg shadow-sm h-[700px] overflow-hidden">
                <ModelViewer fileUrl={file} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 h-[700px] flex flex-col items-center justify-center text-center">
                <svg
                  className="w-20 h-20 text-gray-300 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Model Selected
                </h3>
                <p className="text-gray-500 max-w-md">
                  Upload a STL file using the panel on the left to view and
                  interact with your 3D model
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

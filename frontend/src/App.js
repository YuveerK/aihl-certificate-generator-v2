import React, { useState, useCallback } from "react";
import { Document, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import FileSaver from "file-saver";
import Certificate from "./Certificate";
import Navbar from "./Navbar";
import axios from "axios";
import FileHandler from "./FileHandler";

function App() {
  const [jsonContent, setJsonContent] = useState(null);
  const [moduleName, setModuleName] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setJsonContent(json);
        } catch (error) {
          alert("An error occurred while parsing the JSON file.");
        }
      };
      reader.readAsText(file);
    } else {
      alert("Please select a valid JSON file.");
    }
  };

  const handleModuleNameChange = (event) => {
    setModuleName(event.target.value);
  };

  const headers = [
    "FIRST NAME OF THE LEARNER",
    "MIDDLE NAME OF THE LEARNER",
    "SURNAME OF THE LEARNER",
    "ID NUMBER OF THE LEARNER",
  ];

  const fileHandler = new FileHandler(jsonContent, moduleName);

  const downloadAll = useCallback(async () => {
    await fileHandler.downloadAll(setProgress);
  }, [jsonContent, moduleName]);

  const generateTextFile = useCallback(() => {
    fileHandler.generateTextFile();
  }, [jsonContent, moduleName]);

  const organizeFilesHandler = async () => {
    try {
      const response = await axios.get("http://localhost:3001/organize-files");
      console.log(response.data); // Log the response from the server
    } catch (error) {
      console.error("Error organizing files:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-auto bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-col items-center p-4 flex-grow">
        {/* Progress Bar */}
        <div className="relative pt-1 w-full max-w-lg">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-teal-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="flex h-2 mb-4 overflow-hidden text-xs flex rounded bg-teal-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
            ></div>
          </div>
        </div>
        <div className="flex items-center flex-wrap w-full max-w-lg space-y-4">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded text-black"
          />

          <input
            type="text"
            value={moduleName}
            onChange={handleModuleNameChange}
            placeholder="Enter Module Name"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />

          <button
            onClick={generateTextFile}
            className="w-full mb-4 p-2 border border-teal-500 rounded bg-teal-500 text-white hover:bg-teal-700"
          >
            Generate Text File
          </button>

          <button
            onClick={downloadAll}
            className="w-full mb-4 p-2 border border-blue-500 rounded bg-blue-500 text-white hover:bg-blue-700"
          >
            Download All Certificates
          </button>

          <button
            onClick={organizeFilesHandler}
            className="w-full mb-4 p-2 border border-green-500 rounded bg-green-500 text-white hover:bg-green-700"
          >
            Organize Files
          </button>
        </div>

        {jsonContent && (
          <div className="w-full overflow-auto bg-white text-black rounded-lg shadow-lg p-4 mb-4">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  {headers.map((header, index) => (
                    <th key={index} className="px-6 py-4 text-left font-bold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jsonContent.slice(0, 10).map((row, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-gray-200 text-black"
                        : "bg-gray-100 text-black"
                    }
                  >
                    {headers.map((header, index) => (
                      <td key={index} className="px-6 py-4">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

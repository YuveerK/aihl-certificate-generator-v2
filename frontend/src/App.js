import React, { useState, useCallback } from "react";
import { Document, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import FileSaver from "file-saver";
import Certificate from "./Certificate";
import Navbar from "./Navbar";
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
          console.error("Error parsing JSON file:", error);
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
  // Helper function to chunk an array
  const chunkArray = (array, size) => {
    const chunked_arr = [];
    let copied = [...array];
    const numOfChild = Math.ceil(copied.length / size);
    for (let i = 0; i < numOfChild; i++) {
      chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
  };

  const downloadAll = useCallback(async () => {
    console.log("Starting downloadAll function...");
    const zip = new JSZip();

    // Chunk jsonContent array into smaller arrays of size 100 (or any other size you find suitable)
    console.log("Chunking jsonContent array...");
    const chunks = chunkArray(jsonContent, 100);
    console.log(`Created ${chunks.length} chunks.`);

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1} of ${chunks.length}...`);
      const pdfs = await Promise.all(
        chunks[i].map(async (row, rowIndex) => {
          console.log(
            `  Generating PDF for row ${rowIndex + 1} of chunk ${i + 1}...`
          );
          const doc = (
            <Certificate
              first_name={
                row["MIDDLE NAME OF THE LEARNER"]
                  ? `${row["FIRST NAME OF THE LEARNER"]} ${row["MIDDLE NAME OF THE LEARNER"]}`
                  : row["FIRST NAME OF THE LEARNER"]
              }
              last_name={row["SURNAME OF THE LEARNER"]}
              id_number={row["ID NUMBER OF THE LEARNER"]}
              course_name={moduleName}
              completed_date={"test"}
            />
          );
          const blob = await pdf(doc).toBlob();
          console.log(
            `  Completed PDF for row ${rowIndex + 1} of chunk ${i + 1}.`
          );
          setProgress(((i + 1) / chunks.length) * 100);

          return {
            name: `${row["FIRST NAME OF THE LEARNER"]}_${row["SURNAME OF THE LEARNER"]}_Certificate.pdf`,
            content: blob,
          };
        })
      );
      console.log(`Completed processing chunk ${i + 1} of ${chunks.length}.`);
      pdfs.forEach((pdf) => {
        zip.file(pdf.name, pdf.content);
      });
    }

    console.log("Generating zip file...");
    const content = await zip.generateAsync({ type: "blob" });
    console.log("Completed generating zip file.");

    console.log("Prompting user to download zip file...");
    FileSaver.saveAs(content, "certificates.zip");
    console.log("Completed downloadAll function.");
  }, [jsonContent, moduleName]);

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
        <div className="flex items-center">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="mb-4 p-2 border border-gray-300 rounded mr-8"
          />

          <input
            type="text"
            value={moduleName}
            onChange={handleModuleNameChange}
            placeholder="Enter Module Name"
            className="mb-4 p-2 border border-gray-300 rounded w-full max-w-lg"
          />

          <button
            onClick={downloadAll}
            className="mb-4 p-2 border border-gray-300 rounded"
          >
            Download All Certificates
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
                  <th></th>
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
                    <td>
                      {/* <PDFDownloadLink
                        document={
                          <Certificate
                            first_name={
                              row["MIDDLE NAME OF THE LEARNER"]
                                ? `${row["FIRST NAME OF THE LEARNER"]} ${row["MIDDLE NAME OF THE LEARNER"]}`
                                : row["FIRST NAME OF THE LEARNER"]
                            }
                            last_name={row["SURNAME OF THE LEARNER"]}
                            id_number={row["ID NUMBER OF THE LEARNER"]}
                            course_name={moduleName}
                            completed_date={"test"}
                          />
                        }
                        fileName={`${row["FIRST NAME OF THE LEARNER"]}_${row["SURNAME OF THE LEARNER"]}_Certificate.pdf`}
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? "Loading document..." : "Download now!"
                        }
                      </PDFDownloadLink> */}
                    </td>
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

// FileHandler.js

import React from "react";
import { Document, pdf } from "@react-pdf/renderer";
import JSZip from "jszip";
import FileSaver from "file-saver";
import Certificate from "./Certificate";

class FileHandler {
  constructor(jsonContent, moduleName) {
    this.jsonContent = jsonContent;
    this.moduleName = moduleName;
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  generateTextContent(row, index) {
    const firstName = row["FIRST NAME OF THE LEARNER"] || "";
    const middleName = row["MIDDLE NAME OF THE LEARNER"]
      ? ` ${row["MIDDLE NAME OF THE LEARNER"]}`
      : "";
    const lastName = row["SURNAME OF THE LEARNER"] || "";
    return `${index + 1}_${firstName}${middleName} ${lastName} - ${
      this.moduleName
    }`;
  }

  async generatePDF(row, index) {
    const doc = (
      <Certificate
        first_name={
          row["MIDDLE NAME OF THE LEARNER"]
            ? `${row["FIRST NAME OF THE LEARNER"]} ${row["MIDDLE NAME OF THE LEARNER"]}`
            : row["FIRST NAME OF THE LEARNER"]
        }
        last_name={row["SURNAME OF THE LEARNER"]}
        id_number={row["ID NUMBER OF THE LEARNER"]}
        course_name={this.moduleName}
        completed_date={"test"}
      />
    );
    const blob = await pdf(doc).toBlob();
    return {
      name: `${this.generateTextContent(row, index)}.pdf`,
      content: blob,
    };
  }

  async downloadAll(setProgress) {
    if (!this.jsonContent || !this.moduleName) {
      alert("Please upload the JSON file and enter the module name.");
      return;
    }
    const zip = new JSZip();
    const chunks = this.chunkArray(this.jsonContent, 100);

    for (let i = 0; i < chunks.length; i++) {
      // Adjusted the map function to calculate a global index
      const pdfs = await Promise.all(
        chunks[i].map((row, rowIndex) => {
          const globalIndex = i * 100 + rowIndex; // Calculate global index
          return this.generatePDF(row, globalIndex);
        })
      );
      pdfs.forEach((pdf) => zip.file(pdf.name, pdf.content));
      setProgress(((i + 1) / chunks.length) * 100);
    }

    const content = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(content, `${this.moduleName}.zip`);
  }

  generateTextFile() {
    if (!this.jsonContent || !this.moduleName) {
      alert("Please upload the JSON file and enter the module name.");
      return;
    }

    let textContent = "";
    this.jsonContent.forEach((row, index) => {
      textContent += `${this.generateTextContent(row, index)}\n`;
    });

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, "data.txt");
  }
}

export default FileHandler;

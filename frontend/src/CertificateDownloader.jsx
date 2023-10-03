import React from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Certificate from "./Certificate";

const CertificateDownloader = ({ data, moduleName }) => {
  return (
    <BlobProvider
      document={
        <Certificate
          first_name={data["FIRST NAME OF THE LEARNER"]}
          last_name={data["SURNAME OF THE LEARNER"]}
          id_number={data["ID NUMBER OF THE LEARNER"]}
          course_name={moduleName}
          completed_date={"2023/10/03"}
        />
      }
    >
      {({ blob, loading, error }) => {
        if (blob && !loading && !error) {
          saveAs(
            blob,
            `${data["FIRST NAME OF THE LEARNER"]}_${data["SURNAME OF THE LEARNER"]}.pdf`
          );
          return null;
        }

        if (loading) {
          return <div>Loading...</div>;
        }

        if (error) {
          return <div>Error: {error.message}</div>;
        }

        return null;
      }}
    </BlobProvider>
  );
};

export default CertificateDownloader;

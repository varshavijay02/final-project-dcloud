import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";
// require("dotenv").config();

const FileUpload = ({ contract, account, provider }) => {
  // console.log("File uploaded to account:", account);
  // console.log("File uploaded to provider:", provider);
  // console.log("File uploaded to contract:", contract);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("no file selected");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked");
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            //delete the secret api key and api key when
            //uploading to github...
            pinata_api_key: `99e42b2d1884fca81307`,
            pinata_secret_api_key: `af8a51605b2cb6f594aef57bb394ecffdca69421adaa00705d974510dc0aca73`,
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            // Authorization: `${process.env.JWT}`,
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract.add(account, ImgHash);
        alert("Successfully Uploaded File");
        setFileName("No file selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload file to pinata");
        console.log("Unable to upload file to pinata");
      }
    }
  };
  const retrieveFile = (event) => {
    // console.log("clicked");
    const data = event.target.files[0]; // 1st in an array of files is selected.
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(event.target.files[0]);
    };
    setFileName(event.target.files[0].name);
    event.preventDefault();
  };
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose File
          <input
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            onChange={retrieveFile}
          />
        </label>
        {/* <button id="upload-button" onClick={retrieveFile}>
            Upload
            </button> */}
        <span className="textArea">File:{fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload
        </button>
      </form>
    </div>
  );
};
export default FileUpload;

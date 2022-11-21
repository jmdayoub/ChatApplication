import React from "react";
import { useDropzone } from "react-dropzone";
import debug from "sabio-debug";
import fileServices from "../../services/fileService";
import "./fileupload.css";
import PropTypes from "prop-types";

const _logger = debug.extend("FileUpload");

function FileUpload(props) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      onSubmitHandler(acceptedFiles);
    },
  });

  const onSubmitHandler = (files) => {
    const formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      formData.append("fileList", element);
    }
    _logger(formData, files);
    fileServices
      .uploadFile(formData)
      .then(onUploadFileSuccess)
      .catch(onUploadFileError);
  };

  const onUploadFileSuccess = (response) => {
    if (response?.items?.length > 0) {
      const fileUrl = response.items;
      _logger({ success: fileUrl });
      props.onUploadSuccess(fileUrl);
    }
  };

  const onUploadFileError = (error) => {
    _logger({ error: error });
  };

  return (
    <React.Fragment>
      <section className="container">
        <div className="mt-4 p-4 border-dashed text-center">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag n drop some files here, or click to select files</p>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

FileUpload.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default FileUpload;

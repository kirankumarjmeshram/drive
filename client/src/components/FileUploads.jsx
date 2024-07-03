import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const onChangeHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data);
      // Reset the file state after successful upload
      setFile(null);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file: ', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={onSubmitHandler}>
        <div>
          <input type="file" onChange={onChangeHandler} />
        </div>
        <div>
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;

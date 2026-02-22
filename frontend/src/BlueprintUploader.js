import React, { useState } from 'react';
import axios from 'axios';
import './BlueprintUploader.css';

const BlueprintUploader = () => {
  const [file, setFile] = useState(null);
  const [structureType, setStructureType] = useState('solid');
  const [hexSize, setHexSize] = useState(10.0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUploadResult(null);

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('structure_type', structureType);
    formData.append('hex_size', hexSize);

    try {
      const response = await axios.post('http://localhost:8000/api/upload-blueprint', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadResult(response.data);
    } catch (err) {
      setError('An error occurred during file upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploader-container">
      <div className="panel">
        <div className="panel-title">Blueprint Uploader</div>
        <form onSubmit={handleSubmit}>
          <div className="control-group">
            <label className="control-label">Blueprint File:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="control-group">
            <label className="control-label">Structure Type:</label>
            <select value={structureType} onChange={(e) => setStructureType(e.target.value)}>
              <option value="solid">Solid</option>
              <option value="honeycomb">Honeycomb</option>
              <option value="bone">Bone</option>
              <option value="mesh">Mesh</option>
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Hex Size:</label>
            <input
              type="number"
              value={hexSize}
              onChange={(e) => setHexSize(parseFloat(e.target.value))}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload and Convert'}
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-title">Upload Result</div>
        {error && <p className="error">{error}</p>}
        {uploadResult && (
          <div className="results">
            <p>Filename: {uploadResult.filename}</p>
            <h4>Shapes:</h4>
            <pre>{JSON.stringify(uploadResult.shapes, null, 2)}</pre>
          </div>
        )}
        {!uploadResult && !error && <p>Upload a file to see the results.</p>}
      </div>
    </div>
  );
};

export default BlueprintUploader;

import React, { useState, useRef } from 'react';
import './UploadSection.css';

interface UploadSectionProps {
    onAnalysisComplete: (data: any) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onAnalysisComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            startAnalysis(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            startAnalysis(e.target.files[0]);
        }
    };

    const startAnalysis = async (file: File) => {
        console.log('Analyzing:', file.name);
        setIsAnalyzing(true);

        try {
            // Dynamic import
            const { extractTextAndImage } = await import('../services/pdf-service');
            const { analyzeResume } = await import('../services/ai-service');

            // Get API Key & Model
            // Use Environment Variable or fallback to internal/user var if valid (Vite requires VITE_ prefix)
            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
            const model = 'gpt-4o'; // Hardcoded for now as part of removal request

            if (!apiKey) {
                console.error("Missing API Key in environment variables.");
                alert("Server Config Error: Missing OpenAI API Key. Please notify the administrator.");
                setIsAnalyzing(false);
                return;
            }

            // 1. Extract Text & Image
            const { text, profileImage } = await extractTextAndImage(file);

            // 2. Analyze Text
            const data = await analyzeResume(text, apiKey, model);

            // 3. Attach Image if found
            if (profileImage) {
                data.profileImage = profileImage;
            }

            setIsAnalyzing(false);
            onAnalysisComplete(data);
        } catch (error) {
            console.error("Analysis failed:", error);
            setIsAnalyzing(false);
            alert("Failed to analyze resume. Check console or verify API Key.");
        }
    };

    return (
        <div className={`upload-container ${isAnalyzing ? 'analyzing' : ''}`} style={{ position: 'relative' }}>


            {!isAnalyzing ? (
                <div
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".pdf"
                        hidden
                    />
                    <div className="icon-cloud">☁️</div>
                    <h3>Upload your CV</h3>
                    <p>Drag & drop or click to browse</p>
                    <span className="file-types">Supports PDF</span>
                </div>
            ) : (
                <div className="analysis-view">
                    <div className="ai-loader">
                        <div className="scanner"></div>
                    </div>
                    <h3>AI is reading your story...</h3>
                    <p>Analyzing skills, experience, and portfolio potential</p>
                </div>
            )}
        </div>
    );
};

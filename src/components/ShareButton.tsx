import React, { useState } from 'react';

interface ShareButtonProps {
    userId: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ userId }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        // Construct URL with query param
        const url = `${window.location.origin}/?u=${userId}`;

        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleShare}
            style={{
                background: copied ? 'var(--color-success, #4caf50)' : 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: copied ? '#fff' : 'var(--color-text)',
                marginLeft: '1rem',
                transition: 'all 0.3s ease'
            }}
        >
            {copied ? "Link Copied! 📋" : "Share Profile 🔗"}
        </button>
    );
};

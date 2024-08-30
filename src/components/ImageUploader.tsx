import React, { useState, ChangeEvent } from 'react';

const ImageUploader: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <label htmlFor="picture">
                Take a picture using back facing camera:
            </label>
            <input
                id="picture"
                name="picture"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
            />
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="Selected"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            )}
        </div>
    );
};

export default ImageUploader;

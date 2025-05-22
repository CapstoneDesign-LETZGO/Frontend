import React, { useRef } from 'react';

const MAX_IMAGES = 5;

interface ImageData {
    file: File;
    preview: string;
}

interface AddImageProps {
    images: ImageData[];
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
}

const AddImage: React.FC<AddImageProps> = ({ images, setImages }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (images.length + files.length > MAX_IMAGES) {
            alert(`이미지는 최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다.`);
            e.target.value = '';
            return;
        }
        const selectedFiles = files.slice(0, MAX_IMAGES - images.length);

        Promise.all(
            selectedFiles.map(
                (file) =>
                    new Promise<ImageData>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve({ file, preview: reader.result as string });
                        reader.readAsDataURL(file);
                    })
            )
        ).then((newImages) => {
            setImages((prev) => [...prev, ...newImages]);
        });
        e.target.value = '';
    };

    return (
        <>
            {images.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto overflow-y-hidden pb-2 max-w-full">
                    {images.map(({ preview }, index) => (
                        <div key={index} className="relative w-60 h-60 flex-shrink-0">
                            <img
                                src={preview}
                                alt={`uploaded-${index}`}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                                className="absolute top-1 right-1 bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition"
                            >
                                <img src="/icons/system/close_line.svg" alt="삭제" className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
            />
        </>
    );
};

export default AddImage;
